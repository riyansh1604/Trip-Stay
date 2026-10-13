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

if (filters && leftBtn && rightBtn) {
    const manageButtons = () => {
        if (window.innerWidth < 768) {
            leftBtn.style.display = "none";
            rightBtn.style.display = "none";
            return;
        }

        leftBtn.style.display = "flex";
        rightBtn.style.display = "flex";
        leftBtn.style.visibility = filters.scrollLeft <= 0 ? "hidden" : "visible";
        rightBtn.style.visibility =
            filters.scrollLeft + filters.clientWidth >= filters.scrollWidth - 1
                ? "hidden"
                : "visible";
    };

    leftBtn.onclick = () => {
        filters.scrollBy({ left: -300, behavior: "smooth" });
    };

    rightBtn.onclick = () => {
        filters.scrollBy({ left: 300, behavior: "smooth" });
    };

    filters.addEventListener("scroll", manageButtons);
    window.addEventListener("resize", manageButtons);
    manageButtons();
}

const taxSwitch = document.getElementById("taxSwitch");
const taxToggleLabel = document.getElementById("taxToggleLabel");
if (taxSwitch && taxToggleLabel) {
    taxSwitch.addEventListener("click", () => {
        let taxInfo = document.getElementsByClassName("tax-info");
        for (info of taxInfo) {
            if (info.style.display != "inline") {
                taxToggleLabel.innerText = "Display total after taxes";
                info.style.display = "inline";
            } else {
                taxToggleLabel.innerText = "Display total before taxes";
                info.style.display = "none";
            }
        }
    });
}