// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()


//filters ke liye button hai
const filters = document.getElementById("filters");
    const leftBtn = document.getElementById("leftBtn");
    const rightBtn = document.getElementById("rightBtn");

    // Ye function check karta hai ki scroll kahan tak pahauncha
    const manageButtons = () => {
        // Agar left scroll 0 hai (yani starting point par hai)
        if (filters.scrollLeft <= 0) {
            leftBtn.style.display = "none";
        } else {
            leftBtn.style.display = "flex";
        }

        // Agar total scrollable width, visible width ke barabar ho gayi (yani end point par hai)
        // -1 lagaya hai taaki decimal pixels ki wajah se condition fail na ho
        if (filters.scrollLeft + filters.clientWidth >= filters.scrollWidth - 1) {
            rightBtn.style.display = "none";
        } else {
            rightBtn.style.display = "flex";
        }
    };

    // Jab bhi arrow buttons par click hoga
    leftBtn.onclick = () => {
        filters.scrollBy({ left: -300, behavior: "smooth" });
    };
    
    rightBtn.onclick = () => {
        filters.scrollBy({ left: 300, behavior: "smooth" });
    };

    // Jab bhi user scroll karega ya screen resize hogi, buttons ki visibility update hogi
    filters.addEventListener("scroll", manageButtons);
    window.addEventListener("resize", manageButtons);

    // Page load hone par ek baar function run kar do taaki initially left arrow hide rahe
    manageButtons();

let taxSwitch = document.getElementById("taxSwitch");
    let taxToggleLabel = document.getElementById("taxToggleLabel");
    taxSwitch.addEventListener("click", () =>{
        let taxInfo = document.getElementsByClassName("tax-info");
        for(info of taxInfo){
            if(info.style.display != "inline"){
                taxToggleLabel.innerText = "Display total after taxes";
                info.style.display = "inline";
            }else{
                taxToggleLabel.innerText = "Display total before taxes";
                info.style.display = "none";
            }
        }
    });