const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');

document.getElementById('username').textContent = username;
document.getElementById('username-display').textContent = username;

/*
const postImageInput = document.getElementById('post-image');
const postImagePreview = document.getElementById('post-image-preview');

postImageInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.addEventListener('load', (event) => {
    postImagePreview.src = event.target.result;
  });

  reader.readAsDataURL(file);
});
*/
const signOutButton = document.getElementById("sign-out-button");
signOutButton.addEventListener("click", () => {

  localStorage.removeItem("authToken");

  window.location.href = "https://fauna-animal-media.netlify.app/";
});

// FRONT END: API IMPLEMENTATION - Instagram's Basic Display API //
// Retrieve media data and render feeds on page
fetch('https://nodejs-fauna.jalenea.repl.co/')
  .then(response => response.json())
  .then(data => {
    // Extract media IDs from response
    const accessToken = data.accessToken; // assuming your backend API returns the access token in the response
    const mediaIds = data.feed.map(media => media.id);
    // Retrieve media details for each ID and render feed
    mediaIds.forEach((mediaId, index) => {
      const time = Math.floor(Math.random() * 59) + 1;

      fetch(`https://graph.instagram.com/${mediaId}?fields=id,media_type,media_url,thumbnail_url,username&access_token=${accessToken}`)


        .then(response => response.json())
        .then(media => {
          if (media.media_type === 'IMAGE') {
            // Find user data
            const user = data.feed.find(item => item.id === media.id);
            const username = media.username ? media.username : "";

            // Find caption
            const caption = user ? user.caption : "";

            // Create feed HTML
            const feed = `
  <div class="feed">
    <div class="head">
      <div class="user">
        <div class="profile-photo">
          <img id="instagram-photo" src="https://2img.net/h/lh3.ggpht.com/_S0f-AWxKVdM/TByTpLKmRbI/AAAAAAAAMlo/vqnGXwjWHT0/pikachuy.png">
        </div>
        <div class="info">
          <h3>${username}</h3>
          <small>${time} MINUTES AGO</small>

        </div>
      </div>
      <span class="edit"><i class="uil uil-ellipsis-h"></i></span>
    </div>

    <div class="photo">
      <img src="${media.media_url}">
    </div>

    <div class="action-buttons">
      <div class="interaction-buttons">
        <span><i class="uil uil-heart-sign"></i></span>
        <span><i class="uil uil-comment"></i></span>
        <span><i class="uil uil-share"></i></span>
      </div>
    </div>

    <div class="caption">
      <p><b>${username}</b> ${caption}</p>
    </div>
    <div class="comments text-muted">View all comments</div>
  </div>
`;

            // Append feed to page with spacing
            const mediaDiv = document.getElementById('media');
            if (index === 0) {
              mediaDiv.innerHTML += feed;
            } else {
              mediaDiv.innerHTML += '<br>' + feed;
            }
          }
        })
        .catch(error => {
          console.error(error);
          // handle error
        });
    });
  })
  .catch(error => {
    console.error(error);
    // handle error
  });


//------------------- FUNCTIONALITY ---------------//

// ------------- HASHTAGS  --------------- //
const categories = document.querySelectorAll('.category h6');
const hashtags = document.querySelectorAll('.hashtag');
const categoryLinks = document.querySelectorAll('.right .category h6');
const containers = document.querySelectorAll('.hashtag-container');

function showHashtags(category) {
  containers.forEach(container => {
    if (container.classList.contains(category)) {
      container.classList.add('active');
    } else {
      container.classList.remove('active');
    }
  });
}

categories.forEach(category => {
  category.addEventListener('click', () => {
    const activeCategory = document.querySelector('.category .active');
    if (activeCategory !== category) {
      activeCategory.classList.remove('active');
      category.classList.add('active');
      hashtags.forEach(hashtag => {
        if (hashtag.dataset.category === category.dataset.category) {
          hashtag.classList.add('active');
        } else {
          hashtag.classList.remove('active');
        }
      });
    }
    showHashtags(category.dataset.category);
  });
});

categoryLinks.forEach(link => {
  link.addEventListener('click', () => {
    const category = link.dataset.category;
    containers.forEach(container => {
      if (container.classList.contains(category)) {
        container.classList.add('active');
      } else {
        container.classList.remove('active');
      }
    });
    categoryLinks.forEach(link => {
      link.classList.remove('active');
    });
    link.classList.add('active');
  });
});
// -------------  HASHTAGS  --------------------  //

// SIDEBAR //
const menuItems = document.querySelectorAll('.menu-item');

// THEME //
const theme = document.querySelector('#theme');
const themeModal = document.querySelector('.customize-theme');
const fontSizes = document.querySelectorAll('.choose-size span');
var root = document.querySelector(':root');
const colourPalette = document.querySelectorAll('.choose-colour span');
const Bg1 = document.querySelector('.bg-1');
const Bg2 = document.querySelector('.bg-2');
const Bg3 = document.querySelector('.bg-3');

/* // CREATE POST //
const uploadModal = document.querySelector('#upload-modal');
const uploadButton = document.querySelector('#userpost');
const closeUploadModal = document.querySelector('.close');
const uploadedImage = document.querySelector('#uploaded-image');

uploadButton.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    uploadedImage.src = reader.result;
    uploadModal.style.display = 'block';
  };
});

closeUploadModal.addEventListener('click', () => {
  uploadedImage.src = '';
  uploadModal.style.display = 'none';
});
*/

// Remove Active Class From All Menu Items //
const changeActiveItem = () => {
  menuItems.forEach(item => {
    item.classList.remove('active');
  })
}

menuItems.forEach(item => {
  item.addEventListener('click', () => {
    changeActiveItem();
    item.classList.add('active');
    if (item.id != 'notifications') {
      document.querySelector('.notifications-popup').
        style.display = 'none';
    } else {
      document.querySelector('.notifications-popup').
        style.display = 'block';
      document.querySelector('#notifications .notification-count').
        style.display = 'none';
    }
  })
})

// -- THEME //
// open //
const openThemeModal = () => {
  themeModal.style.display = 'grid';
}

// close //
const closeThemeModal = (e) => {
  if (e.target.classList.contains('customize-theme')) {
    themeModal.style.display = 'none';
  }
}

themeModal.addEventListener('click', closeThemeModal);

theme.addEventListener('click', openThemeModal);

// -------------- FONTS ------------------- //
// remove active class from spans or font size selectors //
const removeSizeSelector = () => (
  fontSizes.forEach(size => {
    size.classList.remove('active');
  })
)

fontSizes.forEach(size => {

  size.addEventListener('click', () => {
    removeSizeSelector();
    let fontSize;
    size.classList.toggle('active');


    if (size.classList.contains('font-size-1')) {
      fontSize = '10px';
      root.style.setProperty('----sticky-top-left', '5.4rem');
      root.style.setProperty('----sticky-top-right', '5.4rem');

    } else if (size.classList.contains('font-size-2')) {
      fontSize = '13px';
      root.style.setProperty('----sticky-top-left', '5.4rem');
      root.style.setProperty('----sticky-top-right', '-7rem');

    } else if (size.classList.contains('font-size-3')) {
      fontSize = '16px';
      root.style.setProperty('----sticky-top-left', '-2rem');
      root.style.setProperty('----sticky-top-right', '-17rem');

    } else if (size.classList.contains('font-size-4')) {
      fontSize = '19px';
      root.style.setProperty('----sticky-top-left', '-5rem');
      root.style.setProperty('----sticky-top-right', '-25rem');

    } else if (size.classList.contains('font-size-5')) {
      fontSize = '22px';
      root.style.setProperty('----sticky-top-left', '-12rem');
      root.style.setProperty('----sticky-top-right', '-35rem');
    }

    // change font size of the root html element //
    document.querySelector('html').style.fontSize = fontSize;

  })
})

// remove active class from colours //
const changeActiveColourClass = () => {
  colourPalette.forEach(colourPicker => {
    colourPicker.classList.remove('active');
  })
}

// Colour Change //
colourPalette.forEach(colour => {
  colour.addEventListener('click', () => {
    let primary;
    // remove active class from colours //
    changeActiveColourClass();

    if (colour.classList.contains('colour-1')) {
      primaryHue = 252;
    } else if (colour.classList.contains('colour-2')) {
      primaryHue = 52;
    } else if (colour.classList.contains('colour-3')) {
      primaryHue = 22;
    } else if (colour.classList.contains('colour-4')) {
      primaryHue = 152;
    } else if (colour.classList.contains('colour-5')) {
      primaryHue = 202;
    }
    colour.classList.add('active');


    root.style.setProperty('--primary-color-hue', primaryHue);
  })
})

// BG Theme VALUES //
let lightColorLightness;
let whiteColorLightness;
let darkColorLightness;

// This Function Changes Background Colour //
const changeBG = () => {
  root.style.setProperty('--light-color-lightness', lightColorLightness);
  root.style.setProperty('--white-color-lightness', whiteColorLightness);
  root.style.setProperty('--dark-color-lightness', darkColorLightness);
}

// ------------ CHANGE BACKGROUNDS ------------------ //
Bg1.addEventListener('click', () => {
  // Add Active Class //
  Bg1.classList.add('active');
  // Remove Active Class From The Rest //
  Bg2.classList.remove('active');
  Bg3.classList.remove('active');
  // remove customized changes from local storage //
  window.location.reload();
});


Bg2.addEventListener('click', () => {
  lightColorLightness = '15%';
  whiteColorLightness = '20%';
  darkColorLightness = '95%';

  // Add Active Class //
  Bg2.classList.add('active');
  // Remove Active Class From The Rest //
  Bg1.classList.remove('active');
  Bg3.classList.remove('active');
  changeBG();
});

Bg3.addEventListener('click', () => {
  lightColorLightness = '0%';
  whiteColorLightness = '10%';
  darkColorLightness = '95%';

  // Add Active Class //
  Bg3.classList.add('active');
  // Remove Active Class From The Rest //
  Bg1.classList.remove('active');
  Bg2.classList.remove('active');
  changeBG();
})

// FIN //
