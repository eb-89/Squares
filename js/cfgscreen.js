
import { Button } from "./button.js"
import { Canvases } from "./canvases.js"

function RadioButtonSelector(cfg, opts, x, y) {
  this.cfg = cfg;
  // console.log(cfg)
  this.x = x;
  this.y = y;
  let buttons = [];

  for (const [i, opt] of opts.entries()) {
    let x = 20 + this.x + i*(30 + 20)
    let y = 20 + this.y;

    const btn = new Button(x, y, 30, 30, i);


    btn.setOnClickHandler(function (idx) {
      btn.color = "yellow";
      for (const prop in opt) {
        this.cfg[prop] = opt[prop];
      }
      for (const btn of buttons) {
        if (btn.idx != idx) {
          btn.color = "blue";
        }
      }
    }.bind(this))
    buttons.push(btn);
  }

  this.buttons = buttons;
}

RadioButtonSelector.prototype.draw = function(ctx) {
  for (const btn of this.buttons ) {


    btn.draw(ctx);
  }
}

RadioButtonSelector.prototype.update = function() {
  for (const btn of this.buttons) {
    btn.update();
  }
}

RadioButtonSelector.prototype.select = function(num) {
  for (const btn of this.buttons) {
    btn.update();
  }
}

RadioButtonSelector.prototype.handleClick = function(x,y) {
  for (const btn of this.buttons) {
    if ( btn.contains(x,y)) {
      btn.onClick();
    }
  }
}

const cfg = function(config) {

  const cvs = Canvases.getCanvas();
  const ctx = cvs.getContext('2d')
  const auxCvs = Canvases.getAuxCanvas(); 

  const cvsWidth = cvs.width;

  const back = {
    x: cvs.width/2 - 40,
    y: 420,
    width: 80,
    height: 50,
    draw(ctx) {
      ctx.fillStyle = "green";
      ctx.fillRect(this.x,this.y, this.width, this.height);

      ctx.font = `normal normal bold 12px Courier`;
      ctx.fillStyle = `black`;
      let text = `back`;
      ctx.fillText(text, this.x + this.width/2 - (ctx.measureText(text).width)/2, this.y + 40 - 12);

    }
  }

  let navigationHandler;

  let vopts = [
    {shown: "red", hidden: "blue"},
    {shown: "darkgreen", hidden: "lightgreen"},
    {shown: "darkgray", hidden: "lightgray"},
  ]

  let mopts = [
    {x: 10, y: 10},
    {x: 15, y: 15}
  ]

  let markeropts = [
    { type: "flag", color: "lightgreen" },
    {  type: "triangle", color: "brown" }
  ]

  let _mcfg = config.mcfg;
  let _vcfg = config.vcfg;

  const selector_color = new RadioButtonSelector(_vcfg.colorscheme, vopts, 50, 50);
  const selector_size = new RadioButtonSelector(_mcfg.dims, mopts, 50, 150);
  const selector_minetype = new RadioButtonSelector(_vcfg.markertype, markeropts, 50, 250);

  return {
    render: function() {

      // Menu text
      let ts = 30;
      ctx.font = `normal normal bold ${ts}px Courier`;
      ctx.fillStyle = `blue`;
      let text = `Squares`;
      ctx.fillText(text, (cvsWidth)/2 - (ctx.measureText(text).width)/2, 100 + ts);

      ts = 12;
      ctx.fillStyle = `blue`;
      ctx.font = `normal normal bold ${ts}px Courier`;
      text = `options`;
      ctx.fillText(text, (cvsWidth)/2 - (ctx.measureText(text).width)/2, 150 + ts);


      ctx.fillStyle = "lightblue";

      ctx.fillRect(Canvases.getCanvas().width/2 - 300, 200, 600, 280)


      text = "Select colors"
      ctx.font ="normal normal bold 12px Courier"
      ctx.fillStyle ="darkblue"
      // 50 + 20  = selector.x + selector.pad
      // 50 + 12  = selector.y + fontsize
      ctx.fillText(text, 50 + 20 , 50 + 12)

      selector_color.draw(ctx);


      text = "Select size"
      ctx.fillStyle ="darkblue"
      ctx.fillText(text, 50 + 20 , 150 + 12)

      selector_size.draw(ctx);

      text = "Select minetype"
      ctx.fillStyle ="darkblue"
      ctx.fillText(text, 50 + 20 , 250 + 12)
      selector_minetype.draw(ctx);
      
      back.draw(ctx);

    },
    handleClick: function(evt) {

      let cvsWidth = Canvases.getCanvas().width;

      const rect = evt.target.getBoundingClientRect();
      const x = evt.clientX - rect.x;
      const y = evt.clientY - rect.y;
      
      selector_color.handleClick(x,y);
      selector_size.handleClick(x,y);
      selector_minetype.handleClick(x,y)
      
      this.render();
      if (
        x > back.x 
        && y > back.y 
        && (back.x + back.width > x)
        && (back.y + back.height > y)
      ) {
        navigationHandler("home");
      }



    },

    handleMouseMove: function(x,y) {
      //no-op;
    },
    setNavigationHandler(nav) {
      navigationHandler = nav;
    }
  }
}

export default cfg;