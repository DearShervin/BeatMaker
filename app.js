class Drumkit {
    constructor(){
        this.pads = document.querySelectorAll('.pad');
        this.playBtn = document.querySelector('.play');
        this.currentKick = 'sounds/kick-classic.wav';
        this.currentSnare = 'sounds/snare-acoustic01.wav';
        this.currentHihat = 'sounds/hihat-acoustic01.wav';
        this.kickAudio = document.querySelector('.kick-sound');
        this.snareAudio = document.querySelector('.snare-sound');
        this.hihatAudio = document.querySelector('.hihat-sound');
        this.index = 0;
        this.bpm = 150;
        this.isPlaying = null;
        this.selects = document.querySelectorAll('select') // we didn't add class (.) because we are selecting all 9 sounds in select tags
        this.muteBtns = document.querySelectorAll('.mute');
        this.tempoSlider = document.querySelector('.tempo-slider');
    }
    activePad(){
        this.classList.toggle('active');
    }
    repeat(){
        let step = this.index % 8;
        const activeBars = document.querySelectorAll(`.b${step}`)
        //Looping Over Pads :
        activeBars.forEach(bar => {
            bar.style.animation = `playTrack .3s alternate ease-in-out 2`; /* the 2 is the alternation count , so it would 
            alternate back to its original position*/
            //we have to get rid of the animation after the animation so it would run again , we add it in drumKit.pads.forEach ...
            //checking of pads are active :
            if(bar.classList.contains('active')) {
                //checking that which pad is active , kick , snare or hihat :
                if(bar.classList.contains('kick-pad')) {
                    /*we also have to set the kickAudio current time to zero so it would play it again even though the last sound has not
                    finished playing*/
                    this.kickAudio.currentTime = 0;
                    this.kickAudio.play();
                }
                if(bar.classList.contains('snare-pad')) {
                    this.snareAudio.currentTime = 0;
                    this.snareAudio.play();
                }
                if(bar.classList.contains('hihat-pad')) {
                    this.hihatAudio.currentTime = 0;
                    this.hihatAudio.play();
                }
            }
        });
        this.index++;
    };
    start(){
        const interval = (60/this.bpm)*1000;
        //Checking if it's playing :
        if(this.isPlaying) {
            //Clearing the interval :
            clearInterval(this.isPlaying);
            this.isPlaying = null;
        } else {
            this.isPlaying = setInterval(() => {
                this.repeat();
            }, interval/*ms*/);
        }
    }
    updateBtn() {
        if(this.isPlaying) {
            this.playBtn.innerText = 'Play';
            this.playBtn.classList.remove('active');
        } else {
            this.playBtn.innerText = 'Stop';
            this.playBtn.classList.add('active');
        }
    }
    changeSound(event) {
        const selectionName = event.target.name;
        const selectionValue = event.target.value;
        switch(selectionName){
            case 'kick-select':
                this.kickAudio.src = selectionValue;
                break;
            case 'snare-select':
                this.snareAudio.src = selectionValue;
                break;
            case 'hihat-select':
                this.hihatAudio.src = selectionValue;
                break;
        }
    }
    mute(event) {
        const muteIndex = event.target.getAttribute('data-track'); // this returns 0 for kick , 1 for snare and 2 for hihat.
        event.target.classList.toggle('active');
        if(event.target.classList.contains('active')) {
            switch(muteIndex) {
                case '0':
                    this.kickAudio.volume = 0;
                    break;
                case '1':
                    this.snareAudio.volume = 0;
                    break;
                case '2':
                    this.hihatAudio.volume = 0;
                    break;
            }
        } else {
            switch(muteIndex) {
                case '0':
                    this.kickAudio.volume = 1;
                    break;
                case '1':
                    this.snareAudio.volume = 1;
                    break;
                case '2':
                    this.hihatAudio.volume = 1;
                    break;
            };
        };
    };
    changeTempo(event) {
        const tempoText = document.querySelector('.tempo-nr');
        tempoText.innerText = event.target.value;
    }
    updateTempo(event) {
        this.bpm = event.target.value;
        clearInterval(this.isPlaying);
        this.isPlaying = null;
        const playBtn = document.querySelector('.play');
        if(playBtn.classList.contains('active')) {
            this.start();
        };
    };
}; 
const drumKit = new Drumkit();

//Event Listeners :

drumKit.pads.forEach(pad => {
    pad.addEventListener('click', drumKit.activePad);
    pad.addEventListener('animationend', function() {
        this.style.animation = ""; //in this case the keyword 'this' refers to the 'pad' , if we did the function with => it wouldn't work
    });
});

drumKit.playBtn.addEventListener('click', () => {
    drumKit.updateBtn();
    drumKit.start();
});

drumKit.selects.forEach(select => {
    select.addEventListener('change', (event) => {
        drumKit.changeSound(event); // we added 'event' as argument in our function so it wouldn't invoke it automatically.
    });
});

drumKit.muteBtns.forEach(btn => {
    btn.addEventListener('click', (event) => {
        drumKit.mute(event);
    });
});

drumKit.tempoSlider.addEventListener('input', (event) => {
    drumKit.changeTempo(event);
});
drumKit.tempoSlider.addEventListener('change', (event) => {
    drumKit.updateTempo(event);
});