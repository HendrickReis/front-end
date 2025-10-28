document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector('.cadastro');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const res = await fetch('/dados', {
      method: 'POST',
      body: formData
    });

    const data = await res.json(); 
    localStorage.setItem('nome', data.nome);
    localStorage.setItem('imagem', data.imagem);

    window.location.href = '/';
  });
})
