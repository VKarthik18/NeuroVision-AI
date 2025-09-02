function initUpload(){
  const drop = document.getElementById("drop");
  const file = document.getElementById("file");
  const preview = document.getElementById("preview");
  const msg = document.getElementById("uploadMsg");
  const send = document.getElementById("sendUpload");

  if(!drop || !file) return;

  drop.addEventListener("click", ()=> file.click());

  file.addEventListener("change", ()=> {
    preview.innerHTML = "";
    Array.from(file.files).forEach(f=>{
      if(!f.type.startsWith("image/")) return;
      const img = new Image();
      img.src = URL.createObjectURL(f);
      img.onload = ()=> URL.revokeObjectURL(img.src);
      preview.appendChild(img);
    });
    msg.textContent = file.files.length ? `${file.files.length} file(s) ready` : "";
  });

  send.addEventListener("click", async ()=> {
    if(!file.files.length){
      msg.textContent = "Please select an image.";
      return;
    }
    msg.textContent = "Analyzing…";
    // TODO: connect to Flask API
    setTimeout(()=> msg.textContent = "Prediction: Mild risk (demo)", 800);
  });
}
window.addEventListener("load", initUpload);
