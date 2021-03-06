var COMMANDS, CONSOLE;

CONSOLE = {
  print: function(value) {
    return $(".console .content").append('<div class="line">' + value + '</div>');
  },
  currentReadCallBack: null
};

COMMANDS = {};

Object.defineProperty(COMMANDS, "addCommand", {
  value: function(cname, func) {
    return COMMANDS[cname] = func;
  }
});

COMMANDS.addCommand("alert", function(str) {
  return alert(str.join(""));
});

COMMANDS.addCommand;

$(".console input").focus();

$(".console input").on("keydown", function(e) {
  var cav, ch, input, nret, nstr, ret, st, _i, _len;
  if (e.keyCode === 13) {
    nstr = "";
    ret = [];
    nret = [];
    cav = false;
    input = $(this).val();
    console.log(input);
    for (ch in input) {
      console.log(ch + " of " + (input.length - 1));
      if (input[ch] === " " && !cav && input[ch - 1] !== "\\") {
        if (nstr !== "") {
          ret.push(nstr);
        }
        nstr = "";
        continue;
      }
      if (ch / 1 + 1 === input.length) {
        if (input[ch] !== '"') {
          nstr += input[ch];
        }
        console.log(nstr);
        if (nstr !== "") {
          ret.push(nstr);
        }
        nstr = "";
        break;
      }
      if (input[ch] === '"' && cav === false && input[ch - 1] !== "\\") {
        cav = true;
        continue;
      }
      if (input[ch] === '"' && cav === true && input[ch - 1] !== "\\") {
        cav = false;
        ret.push(nstr);
        nstr = "";
        continue;
      }
      nstr += input[ch];
    }
    $(this).val("");
    for (_i = 0, _len = ret.length; _i < _len; _i++) {
      st = ret[_i];
      st = st.replace(/\\n/g, "\n");
      st = st.replace(/\\t/g, "\t");
      st = st.replace(/\\"/g, '"');
      st = st.replace(/\\'/g, "'");
      st = st.replace(/\\\s/g, " ");
      nret.push(st);
    }
    if (COMMANDS[nret[0]] === void 0) {
      CONSOLE.print(nret[0] + " not found");
    } else {
      COMMANDS[nret[0]].call(this, nret.slice(1));
    }
  }
  return $(document).scrollTop($(document).height());
});
