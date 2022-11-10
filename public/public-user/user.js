const content = document.getElementById("content");
const username = document.getElementById("username");
const url = window.location.href;
const param =url.slice(url.lastIndexOf('/')+1);
console.log(param);
async function loadContents(current_url){
  await fetch(current_url)
  .then(res => res.json)
  .then((res) => {
    username.innerText = res.username;
     res.links.forEach(element => {
        let list = document.createELement('li');
        list.innerHTML = `<a href='${element.link}'>${element.name}</a>`;
        content.appendChild(list);
    }
    );
  })

}
loadContents(`/api/${param}`);