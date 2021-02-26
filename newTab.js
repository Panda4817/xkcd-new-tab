const pageBody = document.body;
const title = pageBody.querySelector(".comic-title");
const main = pageBody.querySelector(".comic-img");
const footer = pageBody.querySelector(".comic-text")
const date = pageBody.querySelector(".date")
const bookmarkList = pageBody.querySelector(".links")
const topSites = pageBody.querySelector(".sites-container")

const ready = (callback) => {
  if (document.readyState != "loading") callback();
  else document.addEventListener("DOMContentLoaded", callback);
};

const formatDate = (d) => {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let str = '';
  str += days[d.getDay()] + ', ';
  let date = d.getDate().toString();
  let index = 0;
  if (date.length == 2){
    index = 1;
    
  }
  if (date[index] === '1'){
    str += date + 'st';
  } else if (date[index] === '2'){
    str += date + 'nd';
  } else if (date[index] === '3'){
    str += date + 'rd';
  } else {
    str += date + 'th';
  }
  str += ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
  return str;
}

const setComic = () => {
    const firstNum = 1;
    const currentUrl = "https://getxkcd.now.sh/api/comic?num=latest";
    fetch(currentUrl)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        const lastNum = parseInt(data.num);
        const randNum = Math.floor(Math.random() * ((lastNum + 1) - firstNum)) + firstNum;
        const specificUrl = "https://getxkcd.now.sh/api/comic?num=" + randNum
        fetch(specificUrl)
          .then(response => response.json())
          .then(data => {
            console.log(data)
            title.innerHTML = `#${data.num} - ${data.safe_title}`;
            main.innerHTML = `<img src="${data.img}" />`;
            footer.innerHTML = `<p>${data.alt}</p>`;
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
};

const displayBookmarks = (nodes) => {
  const bookmarks = nodes.map(tree => {
    let folders = tree.children;
    str = '';
    for (let i = 0; i < folders.length; i++){
      let arr = folders[i].children;
      for (let j = 0; j < arr.length; j++){
        str += `<li><a class="btn" href="${arr[j].url}" target="_blank">${arr[j].title}</a></li>`;
      }   
    }
    return str;
  }).join('')
  bookmarkList.innerHTML = bookmarks;
}

const displayMostVisited = (arr) => {
  const sites = arr.map(site => {
    return `<a class="btn" href="${site.url}" target="_blank">${site.title}</a>`;
  }).join('');
  topSites.innerHTML = sites;
}

//Determine type of greeting depending on time of day
function greeting() {
  let now_time = new Date();
  if (now_time.getHours() < 12)
      return "Morning"
  else if (now_time.getHours() >= 12 && now_time.getHours() < 17)
      return "Afternoon"
  else
      return "Evening"
}

const getNews = () => {
  const newsUrl = 'https://panda-newsapi.netlify.app/.netlify/functions/getNews';
  fetch(newsUrl, {method: 'post'})
    .then(res => res.json())
    .then(data => {
        console.log(data)
    })
    .catch(err => console.log(err));
}

ready(() => {
  setComic();
  const d = new Date()
  date.innerHTML = `Good ${greeting()}, Today is ${formatDate(d)}`;
  chrome.bookmarks.getTree(nodes =>displayBookmarks(nodes));
  chrome.topSites.get(mostVisited => displayMostVisited(mostVisited));
  getNews();
});