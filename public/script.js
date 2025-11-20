document.getElementById("imageInput").addEventListener("change", function () {
  const file = this.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("preview").innerHTML =
        `<img src="${e.target.result}" />`;
    };
    reader.readAsDataURL(file);
  }
});
