var Modal,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Modal = (function() {
  function Modal() {
    this.init = __bind(this.init, this);
  }

  Modal.prototype.id = "";

  Modal.prototype.type = "";

  Modal.prototype.title = "";

  Modal.prototype.text = "";

  Modal.prototype.init = function() {
    var modalBoxId;
    console.log(this);
    modalBoxId = "modal_box_" + (Math.floor(Math.random() * 10000));
    $("body").append("<div class='modal-box' id='" + modalBoxId + "'>  <div class='modal'><div class='modal-header'>  <h4>Simple title</h4>  <div class='close'>    <i></i>  </div></div><div class='modal-body'>  Simple text</div><div class='modal-footer'>  <div class='btn btn-primary yes'>да</div>  <div class='btn no'>нет</div>  <div class='btn ok'>Ok</div></div>  </div></div>");
    this.id = modalBoxId;
    if (this.type === 'ok') {
      $("#" + this.id + " .modal").addClass("ok");
    }
    if (this.type === 'confirm') {
      $("#" + this.id + " .modal").addClass("confirm");
    }
    $("#" + this.id + " h4").html(this.title);
    return $("#" + this.id + " .modal-body").html(this.text);
  };

  Modal.prototype.show = function(callback) {
    setTimeout((function(_this) {
      return function() {
        $("#" + _this.id).addClass("show");
        return $("#" + _this.id + " .modal").addClass("show");
      };
    })(this), 10);
    $("#" + this.id + " .yes").on("click", (function(_this) {
      return function() {
        $("#" + _this.id + " .yes").off("click");
        $("#" + _this.id + " .no").off("click");
        $("#" + _this.id + " .btn.ok").off("click");
        $("#" + _this.id + " .close").off("click");
        $("#" + _this.id + " .modal").removeClass("show");
        setTimeout(function() {
          return $("#" + _this.id).removeClass("show");
        }, 300);
        return callback(true);
      };
    })(this));
    return $("#" + this.id + " .close, " + "#" + this.id + " .no, " + "#" + this.id + " .btn.ok").on("click", (function(_this) {
      return function() {
        $("#" + _this.id + " .btn.ok").off("click");
        $("#" + _this.id + " .yes").off("click");
        $("#" + _this.id + " .no").off("click");
        $("#" + _this.id + " .close").off("click");
        $("#" + _this.id + " .modal").removeClass("show");
        setTimeout(function() {
          return $("#" + _this.id).removeClass("show");
        }, 300);
        return callback(false);
      };
    })(this));
  };

  return Modal;

})();
