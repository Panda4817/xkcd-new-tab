const pageBody = document.body;
const todayComicTitle = pageBody.querySelector(".today-comic-title");
const todayComicMain = pageBody.querySelector(".today-comic-img");
const todayComicFooter = pageBody.querySelector(".today-comic-text");
const comicTitle = pageBody.querySelector(".comic-title");
const comicMain = pageBody.querySelector(".comic-img");
const comicFooter = pageBody.querySelector(".comic-text");
const date = pageBody.querySelector(".date");
const bookmarkList = pageBody.querySelector(".bookmarkslist");
const topSites = pageBody.querySelector(".sites");
const headlines = pageBody.querySelector(".headlines");
const doodleContent = pageBody.querySelector(".doodle-content");
const doodleText = pageBody.querySelector(".doodle-text");

// const  ready = async (callback) => {
//   if (document.readyState != "loading") callback();
//   else document.addEventListener("DOMContentLoaded", callback);
// };

const formatDate = (d) => {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let str = '';
  str += days[d.getDay()] + ', ';
  let date = d.getDate().toString();
  let index = 0;
  if (date.length == 2) {
    index = 1;

  }
  if (date[index] === '1') {
    str += date + 'st';
  } else if (date[index] === '2') {
    str += date + 'nd';
  } else if (date[index] === '3') {
    str += date + 'rd';
  } else {
    str += date + 'th';
  }
  str += ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
  return str;
}


const firstNum = 1;

const fetchComic = async (num) => {
  if (num === 0){
    const currentUrl = "https://panda-serverless-api.netlify.app/.netlify/functions/getComic";
    const response = await fetch(currentUrl, { method: 'post' });
    const data = await response.json();
    return data;
  } else {
    const specificUrl = "https://panda-serverless-api.netlify.app/.netlify/functions/getComic?num=" + num;
    const response = await fetch(specificUrl, { method: 'post' });
    const data = await response.json();
    return data;
  }
}

const setLatestComic = (d, callback) => {
  checkStorage("latestComic", async (value) => {
    let data;
    if (!value) {
      data = await fetchComic(0);
      chrome.storage.sync.set({ "latestComic": {"date": new Date().toDateString(), "data": data}});
    } else if (value["date"] === d.toDateString() && value["data"] !== undefined) {
      data = value["data"];
    } else {
      data = await fetchComic(0);
      chrome.storage.sync.set({ "latestComic": {"date": new Date().toDateString(), "data": data}});
    }
    todayComicTitle.innerHTML = `#${data.num} - ${data.safe_title}`;
    todayComicMain.innerHTML = `<a href="https://www.explainxkcd.com/wiki/index.php/${data.num}" target="_blank">
    <img src="${data.img}" title="Click for explanation"/></a>`;
    todayComicFooter.innerHTML = `<p>${data.alt}</p>`;
    callback(data.num);
  })
}

const setRandomComic = async (lastNum) => {
  const randNum = Math.floor(Math.random() * ((lastNum + 1) - firstNum)) + firstNum;
  const data = await fetchComic(randNum);
  comicTitle.innerHTML = `#${data.num} - ${data.safe_title}`;
  comicMain.innerHTML = `<a href="https://www.explainxkcd.com/wiki/index.php/${data.num}" target="_blank">
  <img src="${data.img}" title="Click for explanation"/></a>`;
  comicFooter.innerHTML = `<p>${data.alt}</p>`;
}

const displayBookmarks = (nodes) => {
  checkStorage("bookmarks", (display) => {
    if (display) {
      pageBody.querySelector(".bookmarks").style.display = 'block';
      const bookmarks = nodes.map(tree => {
        let folders = tree.children;
        str = '';
        for (let i = 0; i < folders.length; i++) {
          let arr = folders[i].children;
          for (let j = 0; j < arr.length; j++) {
            str += `<li><a class="btn dark_btn" href="${arr[j].url}" target="_blank">${arr[j].title}</a></li>`;
          }
        }
        return str;
      }).join('')
      bookmarkList.innerHTML = bookmarks;
    } else {
      pageBody.querySelector(".bookmarks").style.display = 'none';
    }
  });


}

const displayMostVisited = (arr) => {
  checkStorage("topsites", (display) => {
    if (display) {
      pageBody.querySelector(".topsites").style.display = 'block';
      const sites = arr.map(site => {
        return `<li><a class="btn dark_btn" href="${site.url}" target="_blank">${site.title}</a></li>`;
      }).join('');
      topSites.innerHTML = sites;
    } else {
      pageBody.querySelector(".topsites").style.display = 'none';
    }
  });


}

//Determine type of greeting depending on time of day
const greeting = (d) => {
  if (d.getHours() < 12)
    return "Morning"
  else if (d.getHours() >= 12 && d.getHours() < 17)
    return "Afternoon"
  else
    return "Evening"
}

const getNews = (callback) => {
  checkStorage("news", (display) => {
    if (display) {
      pageBody.querySelector(".news").style.display = 'block';
      fetch('https://extreme-ip-lookup.com/json/')
        .then(res => res.json())
        .then(response => {
          const newsUrl = 'https://panda-serverless-api.netlify.app/.netlify/functions/getNews?code=' + response.countryCode;
          fetch(newsUrl, { method: 'post' })
            .then(res => res.json())
            .then(data => {
              const headlinesList = data.map(news => {
                return `<a class="ticker-item" style="color: black" href="${news.url}" target="_blank">${news.title}</a>`;
              }).join("");
              headlines.innerHTML = headlinesList;
              callback()
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err))
    } else {
      pageBody.querySelector(".news").style.display = 'none';
    }
  });
}

const fetchDoodle = async (d) => {
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const response = await fetch(`https://panda-serverless-api.netlify.app/.netlify/functions/getDoodle?year=${year}&month=${month}`, { method: 'post' });
  const data = response.json();
  return data;
}

const getDoodle = (d) => {
  checkStorage("doodle", (display) => {
    if (display) {
      pageBody.querySelector(".doodle").style.display = 'block';
      checkStorage("doodle_data", async (value) => {
        let data;
        if (!value){
          data = await fetchDoodle(d)
          chrome.storage.sync.set({"doodle_data": {"date": new Date().toDateString(), "data": data}})
        } else if (value["date"] === d.toDateString() && value["data"]) {
          data = value["data"]
        } else {
          data = await fetchDoodle(d)
          chrome.storage.sync.set({"doodle_data": {"date": new Date().toDateString(), "data": data}})
        }
        const doodleImg = `<a href="${"https://www.google.com/doodles/" + data.name}" target="_blank">
        <img src="${data.alternate_url}" title="${data.translations.en.hover_text}" /></a>`
        doodleContent.innerHTML = doodleImg;
        doodleText.innerHTML = data.share_text;
      })
    } else {
      pageBody.querySelector(".doodle").style.display = 'none';
    }
  });


}

const checkStorage = (key, fn) => {
  chrome.storage.sync.get(key, (result) => {
    console.log(result)
    fn(result[key]);
  });
}

const setTheme = () => {
  chrome.storage.sync.get("dark", async function (item) {
    if (item["dark"]) {
        document.querySelector('body').classList.remove("light_body");
        document.querySelector('body').classList.add("dark_body");
        const tickerItems = document.querySelectorAll(".ticker-item");
        tickerItems.forEach((el) => {
          el.style.color = "white";
        });
        const els = document.querySelectorAll('.section')
        els.forEach((el) => {
          el.classList.remove("light_section");
          el.classList.add("dark_section");
        });
        const btns = document.querySelectorAll(".btn")
        btns.forEach(el => {
          el.classList.remove("light_btn");
          el.classList.add("dark_btn");
        })
    } else {
      document.querySelector('body').classList.remove("dark_body");
      document.querySelector('body').classList.add("light_body");
      const tickerItems = document.querySelectorAll(".ticker-item");
      tickerItems.forEach((el) => {
        el.style.color = "black";
      });
      const els = document.querySelectorAll('.section')
      els.forEach((el) => {
        el.classList.remove("dark_section");
        el.classList.add("light_section");
      });
      const btns = document.querySelectorAll(".btn")
      btns.forEach(el => {
        el.classList.remove("dark_btn");
        el.classList.add("light_btn");
      })
    }

});
}

document.addEventListener("DOMContentLoaded", async () => {
  const d = new Date();
  date.innerHTML = `Good ${greeting(d)}, Today is ${formatDate(d)}`;
  chrome.bookmarks.getTree(nodes => displayBookmarks(nodes));
  chrome.topSites.get(mostVisited => displayMostVisited(mostVisited));
  getDoodle(d);
  await setLatestComic(d, (lastNum) => {
    setRandomComic(lastNum);
  });
  await getNews(() => {
    setTheme();
  });
  
})