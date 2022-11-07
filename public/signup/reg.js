
const btn = document.getElementById('btn');
const username = document.getElementById('username');
const password = document.getElementById('password');
const msg = document.getElementById('msg');


async function postUser(event){
    event.preventDefault();
  
    const data = {
      username : username.value,
      password : password.value
    } ;
    console.log(data);
    await fetch("/signup", {
        method: "POST",
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(data)
      }).then(res => res.json())
      .then((data) => {
        if(data.isCreated)
        location.href = "/login";
        else
        msg.innerText = data.message;
      })  
}
btn.addEventListener('click',postUser);