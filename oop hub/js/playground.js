
const runBtn = document.getElementById('runBtn');
const clearBtn = document.getElementById('clearBtn');
const codeEl = document.getElementById('code');
const outputEl = document.getElementById('output');
const statusEl = document.getElementById('status');
const statusText = document.getElementById('statusText');
 
function setStatus(state, text){
  statusEl.className = 'status ' + state;
  statusText.textContent = text;
}
 
function escapeHtml(str){
  return str
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;');
}
 
async function runCode(){
  const code = codeEl.value;
  if(!code.trim()){
    outputEl.innerHTML = '<span class="placeholder">Write some code first.</span>';
    return;
  }
 
  runBtn.disabled = true;
  setStatus('running', 'Compiling & running…');
  outputEl.innerHTML = '<span class="placeholder">Running…</span>';
 
  const started = performance.now();
 
  try{
    const res = await fetch('https://wandbox.org/api/compile.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        compiler: 'gcc-head',
        code: code,
        options: 'warning,gnu++17',
        stdin: ''
      })
    });
 
    if(!res.ok){
      throw new Error('Request failed with status ' + res.status);
    }
 
    const data = await res.json();
    const elapsed = ((performance.now() - started) / 1000).toFixed(2);
 
    const compileErr = (data.compiler_error || '').trim();
    const compileMsg = (data.compiler_message || '').trim();
    const runOut = data.program_output || '';
    const runErr = (data.program_error || '').trim();
    const exitCode = typeof data.status !== 'undefined' ? data.status : null;
    const failedToCompile = !runOut && !exitCode && (compileErr || compileMsg);
 
    let html = '';
 
    if(failedToCompile){
      html += '<span class="err-text">' + escapeHtml(compileErr || compileMsg) + '</span>\n';
      setStatus('err', 'Compile error');
    } else {
      if(compileErr){
        html += '<span class="err-text">' + escapeHtml(compileErr) + '</span>\n';
      }
      html += escapeHtml(runOut) || '<span class="placeholder">(no output)</span>';
      if(runErr){
        html += '\n<span class="err-text">' + escapeHtml(runErr) + '</span>';
      }
      const ok = String(exitCode) === '0';
      setStatus(ok ? 'ok' : 'err', ok ? 'Finished' : (data.signal ? 'Terminated: ' + data.signal : 'Exited with code ' + exitCode));
    }
 
    html += '<span class="meta">Exit status: ' + (exitCode === null ? 'n/a' : exitCode) + (data.signal ? ' · signal: ' + data.signal : '') + '  ·  ' + elapsed + 's</span>';
    outputEl.innerHTML = html;
 
  } catch(err){
    setStatus('err', 'Failed to run');
    outputEl.innerHTML = '<span class="err-text">Could not reach the execution service: ' + escapeHtml(err.message) + '</span>';
  } finally {
    runBtn.disabled = false;
  }
}
 
runBtn.addEventListener('click', runCode);
clearBtn.addEventListener('click', () => {
  outputEl.innerHTML = '<span class="placeholder">Click "Run code" to compile and execute. Output will appear here.</span>';
  setStatus('', 'Idle');
});
 
codeEl.addEventListener('keydown', (e) => {
  if(e.key === 'Tab'){
    e.preventDefault();
    const start = codeEl.selectionStart;
    const end = codeEl.selectionEnd;
    codeEl.value = codeEl.value.substring(0, start) + '    ' + codeEl.value.substring(end);
    codeEl.selectionStart = codeEl.selectionEnd = start + 4;
  }
  if((e.ctrlKey || e.metaKey) && e.key === 'Enter'){
    runCode();
  }
});