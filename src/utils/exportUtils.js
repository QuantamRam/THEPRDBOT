import confetti from 'canvas-confetti';

export function downloadMarkdown(filename, text) {
  const element = document.createElement('a');
  const file = new Blob([text], { type: 'text/markdown;charset=utf-8' });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export function downloadJson(filename, object) {
  const element = document.createElement('a');
  const file = new Blob([JSON.stringify(object, null, 2)], { type: 'application/json;charset=utf-8' });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export function copyToClipboard(text) {
  return navigator.clipboard.writeText(text);
}

export function triggerConfetti() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#f54e00', '#dfa88f', '#9fc9a2', '#9fbbe0', '#c0a8dd']
  });
}
