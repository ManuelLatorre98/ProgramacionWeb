function AJAXgetDataEditedElement(id){
    const http= new XMLHttpRequest()
    const apiURL = "http://localhost:3000/operations/edit/"+id
    http.onreadystatechange= function(){
        if(this.readyState == 4 && this.status ==200){
            let data=JSON.parse(this.responseText)
            showActualValues(data[0],id)
        }   
    }
    http.open("GET", apiURL)
    http.send()
}

function AJAXeditData(id,formData){
    const http= new XMLHttpRequest()
    const apiURL = "http://localhost:3000/operations/edit/"+id
    http.onreadystatechange= function(){
        if(this.readyState == 4 && this.status ==201){
            const redirectToURL=this.getResponseHeader("location")
            const storage= window.localStorage //Use this for indicate if need show successfull message in redirected page
            storage.setItem("status","2")//status: 2 code represents edited successful
            window.location.replace(redirectToURL)
        }
    }
    http.open("POST", apiURL)
    http.send(formData)
}

function showActualValues(data,id){
    let inputs= document.getElementsByClassName("form-control")
    let form= document.getElementsByClassName("formEdit")[0]
    form.action="operations/edit/"+id //sets the id to the query to post
    dataToShow=[ data.concept,
                 data.amount,
                 formatDateToInputType(data.date)
            ]//This is the actual data of the element than we want to show, must be ordered with respect to the html inputs
    for (let i = 0; i < inputs.length; i++) { //Prints the data in each input
        inputs[i].value=dataToShow[i]
    }
}

async function main(){
    loadNavBar() //Method from helpers
    if(await AJAXuserLogedIn()){//Method implemented in helpers.js
        let query= window.location.search.substring(1)//Get the query with de id of element to edit
        let id=query.split("editId=")[1]//splits the string and gets de id
        AJAXgetDataEditedElement(id)

        //Save button event
        let searchParams
        let form= document.getElementsByClassName("formEdit")[0]
        form.addEventListener("submit",function(e){
            e.preventDefault()//prevents to make a submit because I use AJAX request
            searchParams = getDataForm(form)
            AJAXeditData(id,searchParams)
        })
    }else{
        window.location.replace("signin.html")
    }
}
main()

