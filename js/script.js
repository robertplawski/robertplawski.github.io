const CONFIG = {
  "user": "robertplawski",
  "show_empty": false
}
const TOKEN = '' // INSERT YOUR TOKEN HERE

const setHyperLink(id, value) => {
  document.querySelectorAll(id)
    .forEach((hyperlink)=>hyperlink.href = value);
}

const setLabels = (id, value) => {
  document.querySelectorAll(id)
    .forEach((label)=>label.innerText = value);
}

const setImages = (id, source) => {
  document.querySelectorAll(id)
    .forEach((image)=>image.src = source);
}

const getLanguageName = (language) => {
  if(language){
    language = language.toLowerCase()
    const correctionTable = {
      'html': 'html5',
      'css': 'css3'
    }

    return "brand-" + (correctionTable[language] || language);
  }else{
    return "question-mark";
  }
}

const headers = {
  "Content-Type":"application/json",
  "Authorization":`Bearer ${TOKEN}`
}

if(!TOKEN){
  delete headers.Authorization
}

fetch(`https://api.github.com/users/${CONFIG.user}`, {
  method: "GET",
  cache: "force-cache",
  headers: headers
})
.then((response)=>response.json())
.then((data)=>{
  const {login, name, bio, html_url, avatar_url} = data;
  console.log(data);
  setLabels('.js-login',login);
  setLabels('.js-name', name);
  setHyperlink('.js-github-hyperlink', html_url)
  setLabels('.js-bio', bio);
  setLabels('.js-url', html_url);
  setImages('.js-profile-picture', avatar_url);
})

fetch(`https://api.github.com/users/${CONFIG.user}/repos`, {
  method: "GET",
  cache: "force-cache",
  headers: headers
})
.then((response)=>response.json())
.then((data)=>{
  console.log(data)
  const multipleReposContainer = document.querySelector('.js-repos');
  data.forEach(async (repo) => {
    const {name, homepage, language, description, html_url} = repo;
    const languageIcon = `<i class='repo__language-icon ti ti-${getLanguageName(language)}'></i>`
    if(!CONFIG.show_empty && !homepage){
      return;
    }
    if(name == `${CONFIG.user}.github.io`){
      return;
    }
    const repoContainer = document.createElement('section');
    repoContainer.classList.add('repo');
    repoContainer.id = name;

    repoContainer.innerHTML = `
      <p class='repo__title'>${languageIcon} <a href='${homepage || html_url}'>${name}</a></p>
      <p class='repo__description'>${description || '???'}</p>
      <div class='repo__footer'>
        <a class='repo__footer__link' href='${homepage}'><i class='ti ti-player-play-filled'></i></a>
        <a class='repo__footer__link' href='${html_url}'><i class='ti ti-link'></i></a>
      </div>
    `;

    multipleReposContainer.appendChild(repoContainer);
  });
})


