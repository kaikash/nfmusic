if localStorage.getItem("config") then CONFIG = JSON.parse(localStorage.getItem("config"))
else
	CONFIG = 
		invertMouseWheel: 
			value: true
			changed: false
		playerVolume:
			value: 0.7
		vkAccessToken:
			value: ""
		vkUserId:
			value: ""
	localStorage.setItem "config", JSON.stringify(CONFIG)
CONFIG.update = () ->
	localStorage.setItem "config", JSON.stringify(CONFIG)
setTimeout () ->
  console.log localStorage.getItem("vk_user_id") == null
  if localStorage.getItem("vk_user_id") == null
    $(".vk-container").attr("style", "transform: scale(1); opacity: 1;")
  else
    $(".vk-container").attr("style", "display: none")
  $(".vk-container").on "click", () ->
    location.href = "https://oauth.vk.com/authorize?client_id=2235991&scope=audio&redirect_uri=" + location.href + "/vkac.html&display=page&v=5.27&response_type=token"
, 10