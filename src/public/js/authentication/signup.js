let warningMessageShowing= false
function AJAXsignup(formData){
    return new Promise((resolve,reject)=>{
        const http= new XMLHttpRequest()
        const apiURL = "http://localhost:3000/signup"
    
        http.onreadystatechange= function(){
            if(this.readyState == 4){
                if(this.status==200){
                    resolve(true)
                }else{
                    resolve(false)
                }
            }
        }
        http.open("POST", apiURL)
        http.send(formData)
    })
}

async function main(){
    if(!await AJAXuserLogedIn()){
        loadNavBar() //Method from helpers
        let searchParams
        let form= document.getElementsByClassName("formSignup")[0]
        form.addEventListener("submit",async function(e){
            e.preventDefault()//prevents to make a submit because I use AJAX request
            searchParams = getDataForm(form)
            let success= await AJAXsignup(searchParams)
            console.log(success)
            if(!success){
                if(!warningMessageShowing){
                    const messageText="The email aready exists"
                    makeMessage(messageText)
                }
            }else{
                window.location.replace("operationslist.html")
            }
        })
    }else{
        window.location.replace("operationslist.html")
    }
}
main()