(function(){


    var PhoneNum = "0779936807";
    var tabContactLink;
    var tabShareLink;
    function booknow(message) {
        let me = document.querySelector("#dis");
        me.style.display = "contents";
    }

    
    resizeUI();
    function resizeUI() {
        if (innerWidth > 700) {
            let mainHeading = document.querySelector("#mainHeading");
            let miniHeading = document.querySelector("#miniHeading");
            mainHeading.style.fontSize = "600%";
            miniHeading.style.fontSize = "500%";
        }
        if (innerWidth < 700) {
            let mainHeading = document.querySelector("#mainHeading");
            let miniHeading = document.querySelector("#miniHeading");
            mainHeading.style.fontSize = "400%";
            miniHeading.style.fontSize = "400%";
        }
    }


   
    let fields = document.querySelectorAll("#navitem");
    
    for (let field of Array.from(fields)) {
        field.addEventListener("click", event => {
            var link = event.target.getAttribute("link");
            
            window.open(link);
        });
    }



})();







    


    
