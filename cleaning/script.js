import {CR, colorClosestToMedian} from './colors.js';


const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

const rotateLeft = a => a.push(a.shift());
const rotateRight = a => a.unshift(a.pop());
const repeat = n => f => {for (let i=0; i<n; i++) f()};


Vue.component('tasks-list', {
  template: `
    <div>
      <p class="week-controls">
        <span class="button" @click="left">⬅️</span>
        <label for="week">Week</label>
        <input type="number" v-model.number="week" id="week" name="week" min="1" max="52" />
        <span class="button" @click="right">➡️</span>
      </p>
      <transition-group id="schedule" name="schedule" tag="div">
        <div class="cell" v-for="item in tasksAndPeople" :key="item">
          <span>{{ item }}</span>
        </div>
      </transition-group>
    </div>
  `,
  props: {week: Number},
  data: function () {
    return {
      startTasks: ["Sopor / Återvinning", "Köket", "Hallar + Tvättstuga", "Vardagsrum", "Toalett + badrum"],
      people: ["Josefin", "Johannes", "Samuel", "Saranna", "Alex"],
      year: new Date().getFullYear() 
    }
  },
  computed: {
    tasks: function () {
      const yearDiff = (this.year - 2021) * 52;
      const a = this.startTasks.map(t => t);
      repeat(this.week + yearDiff)(() => rotateLeft(a));
      return a;
    },
    tasksAndPeople: function() {
        const a = [];
        this.tasks.forEach((t, i) => {
          a.push(this.people[i]);
          a.push(t);
        });
        return a;
    }
  },
  methods: {
    left: function () {
      if (this.week === 1) {
        this.week = 52;
        this.year -= 1;
      } else {
        this.week -= 1;
      }
    },
    right: function () {
      if (this.week === 52) {
        this.week = 1;
        this.year += 1;
      } else {
        this.week += 1;
      }
    }
  }
});


Vue.component('comment', {
    template: `
      <div class="comment" ref="comment">
        <div class="comment-body">
          <span class="comment-time">{{ time }}</span>
          <img class="comment-picture" ref="picture"
           @click="$emit('comment-picture-click', picture)"
           :src="src"
           crossorigin="Anonymous">
          <p class="comment-text">{{ message }}</p>
        </div>
      </div>`,
    props: {
        message: String,
        picture: String,
        ts: String
    },
    mounted: function() {
        const sample = () => Math.floor(255*Math.random());
        const img = this.$refs.picture;
        const comment = this.$refs.comment;
           
        const setColor = () => {
            const imgColor = this.pictureBoundaryColor;
            let textColor; do {
              textColor = [sample(), sample(), sample()];
            } while (CR(textColor, imgColor) < 4.5);

            comment.style['background-color'] = 'rgb(' + imgColor.join(',') + ')';
            comment.style['color'] = 'rgb(' + textColor.join(',') + ')';
        };

        if (img.complete) setColor();
        else img.addEventListener('load', setColor);
    },
    computed: {
        time: function() {
            return new Date(this.ts).toLocaleString('sv');
        },
        src: function() {
            if (this.picture.startsWith('data:image')) 
                return this.picture;

            const googleProxyURL = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=';
            return googleProxyURL + encodeURIComponent(this.picture);
        },
        pictureBoundaryColor: function() {
        const img = this.$refs.picture;
        const comment = this.$refs.comment;

        const canvas = document.createElement('canvas');
        const context = canvas.getContext && canvas.getContext('2d');

        const height = canvas.height = img.naturalHeight || img.offsetHeight || img.height;
        const width = canvas.width = img.naturalWidth || img.offsetWidth || img.width; 

        context.drawImage(img, 0, 0, width, height);

        const border = [
           // right
           ...context.getImageData(width-1, 0, 1, height).data
        ];

        if (img.offsetHeight < comment.clientHeight) {
            // bottom
            border.push(...context.getImageData(0, height - 1, width, 1).data);
        }

        const r = border.filter((_,i) => i % 4 == 0);  
        const g = border.filter((_,i) => i % 4 == 1);
        const b = border.filter((_,i) => i % 4 == 2);

        return colorClosestToMedian(r, g, b);
    },
    }
});
    

Vue.component('conversation', {
  template: `
    <div>
      <textarea v-model:value="text"></textarea>
      <label for="picture">Image: </label>
      <input type="text" v-model:value="picture">
      <input type="submit" @click.prevent="add">
      <p style="color: red" v-if="error">{{ error }}</p>
      <comment
          v-for="message in messages" :key="message.ts"
          :message="message.message"
          :picture="message.picture"
          :ts="message.ts"
          @comment-picture-click="picture = $event">
      </comment>
    </div>
  `,
  data: function() {
    return {
      text: '',
      picture: '',
      messages: [],
      error: ''
    }
  },
  created: function () {
    this.load();
  },
  methods: {
    load: async function () {
      const res = await fetch('/api');
      if (res.status === 200)
          this.messages = await res.json();
    },
    add: async function() {
      if (!this.picture || !this.picture.match(urlRegex) && !this.picture.startsWith('data:image')) {
        this.error = "Choose an image url, or click an image below to reuse it.";
        setTimeout(() => this.error = null, 8000);
        return;
      }

      const message = this.text;
      const picture = this.picture;
      this.text = '';
      this.picture = '';
      
      const res = await fetch('/api', {
        method: 'POST',
        body: JSON.stringify({message, picture})
      });
      
      if (res.status === 200)
        await this.load();
    }
  }
});


const app = new Vue({ el: '#app' });
document.getElementById('app').style.display = 'block';

document.addEventListener('readystatechange', event => { 
    document.getElementsByTagName('video')[0].play();
});
