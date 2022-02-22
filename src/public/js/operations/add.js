function AJAXaddData(formData){
    const http= new XMLHttpRequest()
    const apiURL = "http://localhost:3000/operations/add"
  
    http.onreadystatechange= function(){
        if(this.readyState == 4 && this.status ==201){
            const redirectToURL=this.getResponseHeader("location")
            const storage= window.localStorage //Use this for indicate if need show successfull message in redirected page
            storage.setItem("status","1")//status: 1 code represents added successful
            window.location.replace(redirectToURL)
        }
    }
    http.open("POST", apiURL)
    http.send(formData)
}

async function main(){
    if(await AJAXuserLogedIn()){//Method implemented in helpers.js
        //Save button event
        loadNavBar() //Method from helpers
        let searchParams
        let form= document.getElementsByClassName("formAdd")[0]
        form.addEventListener("submit",function(e){
            e.preventDefault()//prevents to make a submit because I use AJAX request
            searchParams = getDataForm(form)
            AJAXaddData(searchParams)
        })
    }else{
        window.location.replace("signin.html")
    }
}
main()