angular.module('app').controller('controllerHome', function ($scope , $location ,authservice) {

    authservice.auth()

    $scope.redirect = function (path){
        $location.path(path);
    }

    $scope.status = "Attiva"

    let arr = [
        'audio/J. Cole - p r i d e . i s . t h e . d e v i l  feat. Lil Baby (Official Audio).mp3',
        'audio/Paky - Vita Sbagliata .mp3',
        'audio/Rhove - Cancelo.mp3'
    ];

    const canvas = document.getElementById('canvas1');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    let audioSource;
    let analyser;
    let idSong = 0
    let cur_time = 0

    $scope.music = function() {
        audio1.volume=0.5;
        if($scope.status == "Attiva"){
            const audio1 = document.getElementById('audio1');
            audio1.src = play();
            const audioContext = new AudioContext();
            audio1.currentTime = cur_time;
            audio1.play();
            $scope.status = "Disattiva"
            audioSource = audioContext.createMediaElementSource(audio1);
            analyser = audioContext.createAnalyser();
            audioSource.connect(analyser);
            analyser.connect (audioContext.destination);
            analyser.fftSize = 256;
            const bufferLenght = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLenght );
    
            const barWidth = canvas.width/bufferLenght;
            let barHeight;
            let x;
    
            function animate(){
                x = 0;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                analyser.getByteFrequencyData(dataArray);
                drawVisualiser(bufferLenght, x, barWidth, barHeight, dataArray);
                requestAnimationFrame(animate);
            }
            animate();
        }else {
            audio1.pause()
            cur_time = audio1.currentTime;
            $scope.status = "Attiva"
        }
    
    }
    
    
    //funzione animazione canvas
    function drawVisualiser(bufferLenght, x, barWidth, barHeight, dataArray){
    for(let i = 0; i<bufferLenght; i++){
        barHeight = dataArray[i];
        const red = i * barHeight/20;
        const green = i * 6;
        const blue = barHeight/2;
        ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth;
        }
    }
    function play() {
        audio1.src = arr[idSong];
        return audio1.src
    }

    audio1.onended = function () {
        if (idSong != arr.length - 1) {
            idSong++
            audio1.src = play()
            audio1.play();
        } else {
            idSong = 0
            audio1.src = play()
            audio1.play();
        }
    };
});

