app_images = {
    "honeygain": "https://i.pinimg.com/736x/76/ca/8e/76ca8ea85b973ad8168da76b5ab4ceb3.jpg",
    "pawns": "https://th.bing.com/th/id/OIP.9i3qZ-ms0PP_Lga4Re6P3QHaHa?w=174&h=180&c=7&r=0&o=5&pid=1.7",
    "earnfm": "https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/0f/92/9f/0f929f23-96d7-76c8-6222-fa22f2548f7e/AppIcon-0-0-1x_U007emarketing-0-7-0-0-85-220.png/512x512bb.jpg",
    "bytelixr": "https://play-lh.googleusercontent.com/V2EJrOexlr9y3HAv_-aIqN3Q61TV0PyU-JxlTtUhdoO_H1Cx86EdXRBwNl8ceWxhuRM",
    "traffmonetizer": "https://play-lh.googleusercontent.com/F_4sKaIS_I4GPpTOLpmNADAdYOLjc8ofGMze9wI0rpIK4hQ1WBLguEhuCA2MqxUYyf27=w240-h480",
    "earnapp":"https://earnapp.com/wp-content/uploads/2024/12/eranapp_favicon.svg"
}

let data;
const prohibited = ["enabled", "docker_platform"];
async function addTogglebars() {
    try {
        const response = await fetch(window.location.origin + "/supported_apps");

        const appContainer = document.getElementById("appContainer");
        if (response.ok) {
            data = await response.json();
            console.log(data)

            for (let app in data) {

                const appElement = document.createElement("div");
                appElement.className = "appelement";

                const values = document.createElement("div");
                values.className = "app";
                appElement.style.transition = "height 0.3s ease"; // Smooth transition

                
                // Create the image element
                const image = document.createElement('img');
                image.src = app_images[app] || 'static/M4B_logo_small.png';  // Fallback image

                // Create the h3 element for data['name']
                const appName = document.createElement("h3");
                appName.textContent = data[app].name || app;  // Assuming data contains more info, like 'name'

                // Create the switch container (label with input and span for slider)
                const switchLabel = document.createElement("label");
                switchLabel.className = "switch";

                // Create the checkbox input element
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                
                // Create the slider span
                const slider = document.createElement("span");
                slider.className = "slider round";

          
                checkbox.addEventListener('change', (event) => {
                    if (event.target.checked) {
                        console.log(`${app} is enabled`);
                        appElement.style.height = "300px"; // Increase height on toggle ON
                        // Make input groups visible
                        let inputGroups = appElement.querySelectorAll('.input-group');
                        inputGroups.forEach(group => {
                            group.style.display = 'block'; // Change the display to 'block' to make it visible
                        });


                    } else {
                        console.log(`${app} is disabled`);
                        appElement.style.height = "75px"; // Reset height on toggle OFF
                        let inputGroups = appElement.querySelectorAll('.input-group');
                        inputGroups.forEach(group => {
                            group.style.display = 'none'; // Change the display to 'block' to make it visible
                        });

                    }
                });

                // Append the checkbox and slider to the switch label
                switchLabel.appendChild(checkbox);
                switchLabel.appendChild(slider);

                // Append the image, appName (h3), and switchLabel to the appElement
                values.appendChild(image);
                values.appendChild(appName);
                values.appendChild(switchLabel);

                appElement.appendChild(values);

                for (let property in data[app]) {
                    if (!prohibited.includes(property)) {  // Use `.includes()` to check in array
                        addinputs(appElement, property,app);
                    }
                }
                
                // Append the appElement to the appContainer
                appContainer.appendChild(appElement);
            }
        
        } else {
            console.error("Failed to fetch apps:", response.statusText);
        }
    } catch (error) {
        console.error("Error occurred while fetching apps:", error);
    }
}


function addinputs(element, placeholdername, app) {
    console.log(placeholdername);
    let inputGroup = document.createElement("div");
    inputGroup.className = "input-group";
    inputGroup.id = app;

    // Create the input element
    let input = document.createElement("input");
    input.type = "text";
    input.name = "text";
    input.autocomplete = "off";
    input.required = true;
    input.className = "input";

    // Attach the onchange event listener
    input.addEventListener("change", function(event) {

        console.log("Input changed to:", event.target.value);
        data[app][placeholdername] = event.target.value;
        console.log(data);
    });

    // Create the label element
    let label = document.createElement("label");
    label.className = "user-label";
    label.textContent = placeholdername;

    // Append input and label to the wrapper div
    inputGroup.appendChild(input);
    inputGroup.appendChild(label);

    inputGroup.style.display = "none"; // Hide the input group initially
    inputGroup.style.transition = "height 0.3s ease";

    // Append the entire input group to the specified element
    element.appendChild(inputGroup);
}


function saveApps() {
    fetch('/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            // If the response status is not OK, handle errors
            return response.json().then(errorData => {
                createNotification("alert", errorData.error || "An error occurred.");
                throw new Error(errorData.error || "An error occurred.");
            });
        }
        return response.json(); // Proceed if the response is okay
    })
    .then(data => {
        createNotification("success", "Changes made successfully");
    })
    .catch(error => {
        // Log the error in case of any issues during fetch or in the response
        console.error("Error during save:", error);
    });
}


function createNotification(type, message) {
    const types = ['success', 'warning', 'alert'];
    
    if (!types.includes(type)) {
      console.error('Invalid type');
      return;
    }
  
    const notification = document.createElement('div');
    notification.classList.add('notification', type);
    
    // Add icon based on type
    const icon = document.createElement('div');
    icon.classList.add('notification__icon');
    icon.innerHTML = getIconForType(type);
    
    // Add title/message
    const title = document.createElement('div');
    title.classList.add('notification__title');
    title.textContent = message;
    
    // Close button
    const closeButton = document.createElement('div');
    closeButton.classList.add('notification__close');
    closeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 20 20" height="20"><path fill="#ffffff" d="m15.8333 5.34166-1.175-1.175-4.6583 4.65834-4.65833-4.65834-1.175 1.175 4.65833 4.65834-4.65833 4.6583 1.175 1.175 4.65833-4.6583 4.6583 4.6583 1.175-1.175-4.6583-4.6583z"></path></svg>';
    
    // Append all elements to the notification
    notification.appendChild(icon);
    notification.appendChild(title);
    notification.appendChild(closeButton);
    
    document.body.appendChild(notification);
  
    // Show the notification with slide-in effect
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
  
    // Close the notification when the close button is clicked
    closeButton.addEventListener('click', () => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 500); // Wait for animation to complete before removing
    });
    
    // Remove the notification after 5 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 500); // Wait for animation to complete before removing
    }, 5000);
  }
  
  function getIconForType(type) {
    switch(type) {
      case 'success':
        return '<svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" height="24" fill="none"><path fill-rule="evenodd" fill="#ffffff" d="m12 1c-6.075 0-11 4.925-11 11s4.925 11 11 11 11-4.925 11-11-4.925-11-11-11zm4.768 9.14c.0878-.1004.1546-.21726.1966-.34383.0419-.12657.0581-.26026.0477-.39319-.0105-.13293-.0475-.26242-.1087-.38085-.0613-.11844-.1456-.22342-.2481-.30879-.1024-.08536-.2209-.14938-.3484-.18828s-.2616-.0519-.3942-.03823c-.1327.01366-.2612.05372-.3782.1178-.1169.06409-.2198.15091-.3027.25537l-4.3 5.159-2.225-2.226c-.1886-.1822-.4412-.283-.7034-.2807s-.51301.1075-.69842.2929-.29058.4362-.29285.6984c-.00228.2622.09851.5148.28067.7034l3 3c.0983.0982.2159.1748.3454.2251.1295.0502.2681.0729.4069.0665.1387-.0063.2747-.0414.3991-.1032.1244-.0617.2347-.1487.3236-.2554z" clip-rule="evenodd"></path></svg>';
      case 'warning':
        return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="#ffffff" fill-rule="evenodd" d="M12 2a10 10 0 1 1-10 10A10.012 10.012 0 0 1 12 2zm0 18a8 8 0 1 0-8-8 8.009 8.009 0 0 0 8 8zM11 7h2v5h-2V7zm0 7h2v2h-2v-2z" clip-rule="evenodd"></path></svg>';
      case 'alert':
        return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="#ffffff" fill-rule="evenodd" d="M12 2a10 10 0 1 1-10 10A10.012 10.012 0 0 1 12 2zm0 18a8 8 0 1 0-8-8 8.009 8.009 0 0 0 8 8zM11 7h2v5h-2V7zm0 7h2v2h-2v-2z" clip-rule="evenodd"></path></svg>';
      default:
        return '';
    }
  }
  
addTogglebars();

