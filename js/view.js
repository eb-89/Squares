// TODO: break out this file


import Animator from "./animator.js"
import Menuscreen from "./menuscreen.js"
import Mswpscreen from "./mswpscreen.js"
import Endscreen from "./endscreen.js"
import Timer from "./timer.js"


const View = function(cvs, auxCvs, model) {

  let timer = new Timer();
  Animator.setTimer(timer);

  let ctx = cvs.getContext("2d")
  let auxCtx = auxCvs.getContext("2d");

  Animator.setContext(ctx);

  let mswp_params = {
    cellW: 20,
    cellH: 20,
  }

  // prerender

  let ts = 30;
  let text;
  auxCtx.font = `normal normal bold ${ts}px Courier`;
  for (let i = 0; i<10; i++) {
    text = `${i}`;
    auxCtx.fillStyle = "black";
    auxCtx.setTransform(1, 0, 0, 1, 50*i, 0);
    auxCtx.fillText(text, (50 - auxCtx.measureText(text).width)/2, 50/2 + ts/2 - 4);
  }

  ts = 15;
  auxCtx.font = `normal normal bold ${ts}px Courier`;
  auxCtx.setTransform(1, 0, 0, 1, 0, 50);
  text = `Start`;
  auxCtx.fillText(text, (100 - auxCtx.measureText(text).width)/2, ts);

  ts = 15;
  auxCtx.font = `normal normal bold ${ts}px Courier`;
  auxCtx.setTransform(1, 0, 0, 1, 0, 100);
  text = `restart`;
  auxCtx.fillText(text, (100 - auxCtx.measureText(text).width)/2, ts);

  ts = 15;
  auxCtx.font = `normal normal bold ${ts}px Courier`;
  auxCtx.setTransform(1, 0, 0, 1, 0, 150);
  text = `home`;
  auxCtx.fillText(text, (100 - auxCtx.measureText(text).width)/2, ts);

  ts = 30;
  auxCtx.font = `normal normal bold ${ts}px Courier`;
  auxCtx.fontColor = `blue`;
  auxCtx.setTransform(1, 0, 0, 1, 0, 200);
  // ctx.fillStyle = "blue";
  text = `Squares`;
  auxCtx.fillText(text, (150 - auxCtx.measureText(text).width)/2, ts);

  // end of prerender

  let menuscreen = Menuscreen();
  let mswpscreen = Mswpscreen(model, mswp_params);
  let endscreen = Endscreen();
  // let currentScreen = screens.MSWP;
  let screen = menuscreen;

  return {
    handleClick: function(evt) {

      const rect = evt.target.getBoundingClientRect();
      const mouseX = evt.clientX - rect.x;
      const mouseY = evt.clientY - rect.y;
      if (screen.name === "MSWP") {
        screen.handleClick(mouseX, mouseY, function(cell) {
          model.handleAction(cell.x, cell.y)
          if (!model.isRunning()) {
            screen = endscreen;
          }
        });
      } else {
        screen.handleClick(mouseX, mouseY, function(answer) {
          switch(answer) {
            case 'start':
              model.start();
              model.init();
              mswpscreen.getModelData();
              screen = mswpscreen;
            break;
            case 'restart':
              model.start();
              model.init();
              mswpscreen.getModelData();
              screen = mswpscreen;
            break;
            case 'home':
              model.end();
              screen = menuscreen;
            break;
          }
        });
      }
 
    },

    handleMouseMove: function(evt) {

      const rect = evt.target.getBoundingClientRect();
      const mouseX = evt.clientX - rect.x;
      const mouseY = evt.clientY - rect.y;

      screen.handleMouseMove(mouseX, mouseY);
    },

    render: function(timestamp) {
      ctx.setTransform(1, 0, 0, 1,0,0);
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      timer.update(timestamp);

      screen.render(ctx, auxCvs, timestamp);
    }
  }
}





export default View;