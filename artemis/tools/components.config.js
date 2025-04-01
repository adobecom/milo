module.exports = {
  "accordion": {
    "entry": "../../libs/blocks/accordion/accordion.js",
    "block": '.accordion',
    "selectors": [{
      "trigger": "button",
      "event": "click",
      "scope": {
        "x": function(){

        },
      },
      "params": {
        "id": function(ob) {
          const {block, target, } = ob;
          const id = target.id;
          const adArr = id.split('-');
          return adArr[1]
        },
        "num": function(ob) {
          const {block, target, } = ob;
          const id = target.id;
          const adArr = id.split('-');
          return adArr[3]
        },
        "dd": function(ob) {
          const {block, target} = ob;
          const id = target.id;
          const adArr = id.split('-');
          return block.querySelector(`#accordion-${adArr[1]}-content-${adArr[3]}`)
        },
      }
    }]
  },
  "tabs": {
    "entry": "../../libs/blocks/tabs/tabs.js",
    "block": '.tabs',
    "selectors": [
      {
        "trigger": '[role="tablist"]',
        "event": 'keyup',
        "scope": {
          "tabFocus": function(){
            return 0;
          },
          "tabs": function(ob){
            return ob.block.querySelectorAll('[role="tab"]');
          }
        },
        "params": {
          
        }
      },
      {
        "trigger": '[role="tab"]',
        "event": 'click',
        "scope": {

        },
        "params": {
          
        }
      },
      {
        "trigger": '.paddle-left',
        "event": 'click',
        "scope": {
          "tabListItemsArray": function(ob) {
            return [...ob.block.querySelectorAll('[role="tab"]')]
          }
        },
        "params": {
          
        }
      },
      {
        "trigger": '.paddle-right',
        "event": 'click',
        "scope": {
          "tabListItemsArray": function(ob) {
            return [...ob.block.querySelectorAll('[role="tab"]')]
          }
        },
        "params": {
          
        }
      },
  ]
  },
}
