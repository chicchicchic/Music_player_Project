// Cac buoc xay dung project:
// 1.Render songs
// 2. Scroll top
// 3. Play/ pause/ seek (search 'HTMLAudio/Video DOM Reference' trên w3schools để tìm hiểu các method/property làm việc vs audio/video)
// 4. CD rotate
// 5. Next/ prev
// 6. Random
// 7. Next/ repeat when ended
// 8. Active song
// 9. Scroll active song into view
// 10. play song when click



const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Đây là những biến có thể lặp lại nên khai báo global
const player = $('.player');
const cd =$('.cd');
// Biến này dùng để render tên của bài hát
const heading = $('header h2');
// Biến này để đổi url bài hát hiện tại
const cdThumb = $('.cd-thumb');
// Biến này để lấy bài hát
const audio = $('#audio');
// Nút play/pause 
const playBtn = $('.btn-toggle-play');
// Biến này là tiến độ bài hát
const progress = $('#progress');



const app = {
    // currentIndex: 0 nhầm muốn lấy ra chỉ mục đẩu tiên để xử lý, vì phần audio chưa có bài hát nào, nhưng ngay khi app tải ra mình phải load đc bài hát đầu tiên
    currentIndex: 0,
    // isPlaying là property của app, mặc định là chưa phát nhạc (User chưa click Play Btn)
    isPlaying: false,
    songs: [
        {
            name: 'COMFY (돌아온 탕자) - COUCH WORSHIP',
            singer: 'worship 1',
            path: './assets/music/song1.mp3',
            image: './assets/img/song1.PNG'
        },
        {
            name: '기뻐해 I rejoice | 제이어스 J-US',
            singer: 'worship 2',
            path: './assets/music/song2.mp3',
            image: './assets/img/song2.PNG'
        },
        {
            name: 'ON (Feat. 김아연) - 유지연',
            singer: 'worship 3',
            path: './assets/music/song3.mp3',
            image: './assets/img/song3.PNG'
        },
        {
            name: '여호와의 집으로 올라가 - 마커스워십',
            singer: 'worship 4',
            path: './assets/music/song4.mp3',
            image: './assets/img/song4.PNG'
        },
        {
            name: '그곳에서 안무 영상- 서하얀',
            singer: 'worship 5',
            path: './assets/music/song5.mp3',
            image: './assets/img/song5.PNG'
        },
        {
            name: '함부영 - 나의 노래',
            singer: 'worship 6',
            path: './assets/music/song6.mp3',
            image: './assets/img/song6.PNG'
        },
        {
            name: 'In your love-함부영',
            singer: 'worship 7',
            path: './assets/music/song7.mp3',
            image: './assets/img/song7.PNG'
        },
        {
            name: '아무도 없을 때 (정결의 노래) -지선',
            singer: 'worship 8',
            path: './assets/music/song8.mp3',
            image: './assets/img/song8.PNG'
        },
        {
            name: 'Maranatha || 마라나타 || Phạm Thị Yến Nga',
            singer: 'worship 9',
            path: './assets/music/song9.mp3',
            image: './assets/img/song9.PNG'
        },
        {
            name: 'Like You Love Me-Tauren Wells',
            singer: 'worship 10',
            path: './assets/music/song10.mp3',
            image: './assets/img/song10.PNG'
        },
        {
            name: '마커스-길',
            singer: 'worship 11',
            path: './assets/music/song11.mp3',
            image: './assets/img/song11.PNG'
        },
        {
            name: 'みんなで賛美しよう',
            singer: 'worship 12',
            path: './assets/music/song12.mp3',
            image: './assets/img/song12.PNG'
        },
        {
            name: '小さな祈り',
            singer: 'worship 13',
            path: './assets/music/song13.mp3',
            image: './assets/img/song13.PNG'
        },
        {
            name: 'David - 비와이(Bewhy)',
            singer: 'worship 14',
            path: './assets/music/song14.mp3',
            image: './assets/img/song14.PNG'
        },
        {
            name: '은혜로 살게 하시네 (Feat. 백소라)',
            singer: 'worship 15',
            path: './assets/music/song15.mp3',
            image: './assets/img/song15.PNG'
        }
    ],
    render: function() {
        const htmls = this.songs.map(song => {
            return `
                <div class="song">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        // Join vào block html cần render
        $('.playlist').innerHTML = htmls.join('');
    },
    // Tất cả định nghĩa thuộc tính cho Object sẽ đưa vào đầy
    defineProperties: function() {
        // search defineProperty để tìm hiểu
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    // handleEvents này là xử lý tất cả sự kiện của app
    handleEvents: function() { 
        // Biến _this này là app, không dùng thằng this ở dưới event playBtn.onclick vì nó sẽ nghĩ this ở đó là 'playBtn' chứ không phải 'app' 
        const _this = this;

        // biến cdWidth là width hiện tại của nó
        const cdWidth = cd.offsetWidth;


        // Xử lý CD quay / dừng 
        // (search 'Animation Web API' để tìm hiểu, sẽ biết đc 1 keyframe dc tạo ra từ JS)
        const cdThumbAnimate = cdThumb.animate([
            // Quay 360 độ
            { transform: 'rotate(360deg)' }
        ], {
            // Đối số thứ 2 của cdThumb.animate là 1 option sẻ quyết định nó quay như nào
            // Quay trong 10 seconds
            duration: 10000,
            // iterations nghĩa là loop bao nhiu lần, biến Infinity trong JS là vô hạn
            iterations: Infinity
        })
        // Sau khi add animate thì cho nó pause từ dầu luôn chứ không cho nó quay, khi xử lý User play/pause thì nó mới quay/ko quay tiếp 
        // Nếu ko pause thì khi app dc load là nó quay luôn, mặc dù user chưa click play gì hết
        cdThumbAnimate.pause();


        // Lắng nghe event kéo, xử lý phóng to/thu nhỏ cd
        document.onscroll = function() {
            // Kiểm tra nó lắng nghe event kéo
            // console.log(window.scrollY);
            // console.log(document.documentElement.scrollTop);

            // Biến scrollY hoặc scrollTop như này là để sau này nếu trình duyệt nào được cái nào thì lấy cái đó, vì sau này sẽ có trình duyệt hoạt động scrollY có trình duyệt thì hoạt động scrollTop
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            // console.log ra sẽ thấy nó tăng/giảm width hiện tại của cd khi ta scroll thay vì ban đầu biến scrollTop chỉ tăng/giảm theo kích thước trình duyệt 
            // console.log(newCdWidth);

            // Set Css cho width của cd khi ta scroll lên thì cd sẻ nhỏ lại, ta scroll xuống thì cd sẽ lớn dần
            // Dùng toán tử 3 ngôi này để check xem nếu newCdWidth > 0px thì cd vẩn còn, nếu < 0 thì ẩn luôn cd vì nếu không check như vậy thì khi User kéo nhanh quá thì sẽ không bắt được đoạn scroll sẽ khiến cho cd khi bị kéo nhanh sẽ bị dấp trong quá trình thu nhỏ/phóng lớn khi scroll
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            // Set Css cho cd mờ dần khi thu nhỏ và đậm dần khi phóng to
            cd.style.opacity = newCdWidth / cdWidth; 
        }

        // Xữ lý khi User click Play btn
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                // Nếu là isPlaying (mặc định false) thì song sẽ pause
                audio.pause();
            }else {
                // Ngược lại thì song sẽ play
                audio.play();           
            }


            // console.log ra để nhìn phương thức của cdThumbAnimate (trong__proto__), ở đây ta dùng phương thức play, pause
            // console.log(cdThumbAnimate);

            // Khi song đc playing
            audio.onplay = function() {
                _this.isPlaying = true;
                // Khi thêm class 'playing' này vào Selector biến 'player' thì khi User click vào nút play thì nó sẽ chuyển sang icon pause
                player.classList.add('playing');

                // Khi play thì cdThumbAnimate quay
                cdThumbAnimate.play();
            }


            // Khi song ko đc playing (Pause)
            audio.onpause = function() {
                _this.isPlaying = false;
                // Khi thêm class 'playing' này vào Selector biến 'player' thì khi User click vào nút play thì nó sẽ chuyển sang icon pause
                player.classList.remove('playing');

                // Khi ko play thì cdThumbAnimate ko quay
                cdThumbAnimate.pause();
            }


            // Khi tiến độ bài hát thay đổi 
            audio.ontimeupdate = function() {
                // Check nếu là duration ko phải NaN thì
                if(audio.duration) {
                    // currentTime là time hiện tại (tính giây)
                    // duration là tổng time của bài hát (tính giây)
                    // Chia tỷ lệ, tính toán và làm tròn dưới
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                    // Có thể console.log ra để xem
                    // console.log(progressPercent);

                    // Khi progressPercent dc chia tỷ lệ và tính toán thí value của progress cũng thay đổi (xem bên Html cách set value), lúc này thanh trược sẽ trược theo tiến độ bài hát
                    progress.value = progressPercent;

                }
            }

            
            // Xử lý khi User tua bài hát
            progress.onchange = function(e) {
                // Công thức: Tổng số giây bài hát / 100 * giá trị User thay đổi
                // Có thể console.log ra để xem 
                // console.log(audio.duration / 100 * e.target.value);

                const seekTime = audio.duration / 100 * e.target.value;
                audio.currentTime = seekTime;
            }

        }
    },
    // Hàm load bài hát hiện tại
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;

        // console.log ra để thấy nó selector
        console.log(heading, cdThumb, audio);

    },
    start: function() {
        // Định nghĩa các thuộc tính cho Object
        this.defineProperties()

        // Lắng nghe và xử lý các sự kiện (DOM events)
        this.handleEvents()

        // Load thông tin bài hát đầu tiên vào UI khi app được chạy
        this.loadCurrentSong()

        // Render playlist
        this.render()
    }
}
app.start()
