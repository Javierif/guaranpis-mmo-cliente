//=============================================================================
// MMO_LoginForm.js
//=============================================================================

/*:
 * @plugindesc MMORPG Maker MV - Login Form
 * @author Samuel LESPES CARDILLO
 *
 * @help This plugin does not provide plugin commands.
 */

function LoginForm() {
  this.initialize.apply(this, arguments);
}

(function() {  
  LoginForm.Parameters = PluginManager.parameters('MMO_LoginForm');
  LoginForm.connectionLost = false;

  document.addEventListener("mmorpg_core_lost_connection", function() {
    let wasLogged = (MMO_Core_Player.Player.id !== undefined) ? true : false;
    LoginForm.connectionLost = true;

    if(wasLogged) SceneManager.goto(LoginForm);
    
    LoginForm.prototype.displayError("Connection lost.");
  })

  LoginForm.prototype = Object.create(Scene_Base.prototype);
  LoginForm.prototype.constructor = LoginForm;

  LoginForm.prototype.initialize = function() {
      Scene_Base.prototype.initialize.call(this);
  };

  LoginForm.prototype.reBindInput = function() {
    Input.initialize();
  }

  LoginForm.prototype.create = function() {
      Scene_Base.prototype.create.call(this);
      this.createBackground();
      this.createForeground();
  };

  LoginForm.prototype.start = function() {
      Scene_Base.prototype.start.call(this);
      SceneManager.clearStack();
      this.centerSprite(this._backSprite1);
      this.centerSprite(this._backSprite2);
      this.playTitleMusic();
      this.startFadeIn(this.fadeSpeed(), false);
      this.createLoginForm();
  };

  LoginForm.prototype.update = function() {
      Scene_Base.prototype.update.call(this);
  };

  LoginForm.prototype.isBusy = function() {
      return Scene_Base.prototype.isBusy.call(this);
  };

  LoginForm.prototype.terminate = function() {
      Scene_Base.prototype.terminate.call(this);
      SceneManager.snapForBackground();
  };

  LoginForm.prototype.createLoginForm = function() {
    let html = `
    <style>
      #btnConnect {
        background: url('../v2/images/design/buttons/button2-normal-regular.gif');
        background-position-x: 0%;
        background-position-y: 0%;
        background-repeat: repeat;
        background-size: auto;
        background-size: 100% 100%;
        padding-top: 25px;
        padding-bottom: 25px;
        padding-left: 40px;
        padding-right: 40px;
        background-repeat: no-repeat;
        background-position: center center;
        color: white !important;
        font-size: 1em;
        font-weight: bold;
        border: none;
        font-family: antique !important;
      }

      #btnConnect:hover {
        background: url('../v2/images/design/buttons/button2-normal-hover.gif');
        background-position-x: 0%;
        background-position-y: 0%;
        background-repeat: repeat;
        background-size: auto;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center center;
        color: white !important;
        border: none;
        font-family: antique !important;
        box-shadow: none;
      }
    </style>

    <div id="LoginForm" 
        style="
            position: fixed; 
            top: 50vh; 
            left: 50vw; 
            background-color: rgba(0, 0, 0, 0.4); 
            border-radius: 8px; 
            margin: 0 auto; 
            width: 400px; 
            padding: 8px; 
            transform: translate(-50%, 0);
            z-index: 999999999999999; /* yep it's a lot but eh */ 
        "
    >
        <div>
            <div id="loginErrBox" 
                style="
                    display: block; 
                    margin: 0 auto 16px auto; 
                    text-align: center; 
                    width: 100%; 
                    font-family: Comic Sans, arial; 
                    font-size: 18px;
                "
            ></div>

            <button id="btnConnect" 
                style="
                    display: block; 
                    margin: 0 auto; 
                    border: 0;
                    font-size: 24px;"
              >
                  Entrar
              </button>
        </div>
    </div>
    `;


    document.getElementById('text_zone').innerHTML = html;

    const verifyPass = () => {
      const pwdField = document.getElementById('inputPassword');
      const pwdValidPass = !!pwdField.value.length;
      const btnConnect = document.getElementById('btnConnect');
      if (pwdValidPass) {
        btnConnect.classList.remove('disabled');
        return true;
      } else {
        btnConnect.classList.add('disabled');
        return false;
      }
    };

    //Bind commands
    var that = this;

    document.getElementById('btnConnect').addEventListener('click', () => {
      that.connectAttempt()
    });
    // $("#ErrorPrinter").fadeIn({duration: 1000});
    MMO_Core.allowTouch = false;
  }

  LoginForm.prototype.displayError = function(message) {
    document.getElementById("loginErrBox").innerHTML = `<div style="color: red;">${message}</div>`;
  }

  function encode_utf8(s) {
    return unescape(encodeURIComponent(s));
  }

  LoginForm.prototype.connectAttempt = function(){
    
    var that = this;

    var url = window.location.href; // or window.location.href for current url
    var username = /usuario=([^&]+)/.exec(url)[1]; // Value is in [1] ('384' in our case)
    username = username ? username : '';
    // username = username.replace(' ','@')
    username = decodeURI(username);

    // //Eliminamos todo lo que esté despues del espacio
    // var parts = str2.split(/\s*@\s*/);
    // var username = parts[0];
    console.log("USername es " + username);
    let payload = { username: username };

    if (payload.username.length < 3 || payload.username.length >= 55) return this.displayError("Invalid username !");
    // if(payload.username.includes(" ")) return this.displayError("No spaces !");
    //if(!payload.username.match(/^(?=[a-zA-Z0-9\s]{2,25}$)(?=[a-zA-Z0-9\s])(?:([\w\s*?])\1?(?!\1))+$/)) return this.displayError("No special characters.");

    MMO_Core.socket.on("login_success", function(data){
      if (data.err) return that.displayError("Error : " + data.err);
      // $("#ErrorPrinter").fadeOut({duration: 1000s}).html("");

      console.log('info ' + JSON.stringify(data));
      MMO_Core_Player.Player = data["msg"];
      if (MMO_Core_Player.Player['stats'] !== undefined && MMO_Core_Player.Player['stats'] !== '') {
        MMO_Core_Player.Player['stats'] = JSON.parse(MMO_Core_Player.Player['stats']);
      }
      MMO_Core_Player.Player['skin'] = JSON.parse(MMO_Core_Player.Player['skin']);
      that.fadeOutAll();
      DataManager.setupNewGame();

      document.getElementById('LoginForm').style.display = 'none';


      SceneManager.goto(Scene_Map);
      MMO_Core.allowTouch = true;
      // _requestNativeFullScreen({browserOnly:true});
      setTimeout(async () => {
        setTimeout(async () => MMO_Core.socket.emit("new_message", '/count'), 1);
        MMO_Core.socket.emit("new_message", '/all logged in');
      }, 1000);
      return true;
    });

    MMO_Core.socket.on("login_error", function(data) {
      that.displayError(data.msg);      
    })

    // If you're no longer connected to socket - retry connection and then continue
    if (!MMO_Core.socket.connected) {
      MMO_Core.socket.connect();
    }

    MMO_Core.socket.emit("login", payload);
  }

  LoginForm.prototype.createBackground = function() {
      this._backSprite1 = new Sprite(ImageManager.loadTitle1($dataSystem.title1Name));
      this._backSprite2 = new Sprite(ImageManager.loadTitle2($dataSystem.title2Name));
      this.addChild(this._backSprite1);
      this.addChild(this._backSprite2);
  };

  LoginForm.prototype.createForeground = function() {
      this._gameTitleSprite = new Sprite(new Bitmap(Graphics.width, Graphics.height));
      this.addChild(this._gameTitleSprite);
      if ($dataSystem.optDrawTitle) {
          this.drawGameTitle();
      }
  };

  LoginForm.prototype.drawGameTitle = function() {
      var x = 20;
      var y = Graphics.height / 4;
      var maxWidth = Graphics.width - x * 2;
      var text = $dataSystem.gameTitle;
      this._gameTitleSprite.bitmap.outlineColor = 'black';
      this._gameTitleSprite.bitmap.outlineWidth = 8;
      this._gameTitleSprite.bitmap.fontSize = 72;
      this._gameTitleSprite.bitmap.drawText(text, x, y, maxWidth, 48, 'center');
  };

  LoginForm.prototype.centerSprite = function(sprite) {
      sprite.x = Graphics.width / 2;
      sprite.y = Graphics.height / 2;
      sprite.anchor.x = 0.5;
      sprite.anchor.y = 0.5;
  };

  LoginForm.prototype.playTitleMusic = function() {
      AudioManager.playBgm($dataSystem.titleBgm);
      AudioManager.stopBgs();
      AudioManager.stopMe();
  };

  // Overwriting the Title screen to display the login form
  Scene_Title.prototype.start = function() {
      Scene_Base.prototype.start.call(this);
      SceneManager.clearStack();
      SceneManager.goto(LoginForm);
  };

  // Overriding Input._shouldPreventDefault to allow the use of the 'backspace key'
  // in input forms.
  Input._shouldPreventDefault = function(e) {
    if(e === undefined) return;

    // switch (e) {
    //   case 8:     // backspace
    //     if ($(e.target).is("input, textarea"))
    //       break;
    //   case 33:    // pageup
    //   case 34:    // pagedown
    //   case 37:    // left arrow
    //   case 38:    // up arrow
    //   case 39:    // right arrow
    //   case 40:    // down arrow
    //       return true;
    // }
    return false;
  }
})();
