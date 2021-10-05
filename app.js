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

const app = {
    // currentIndex: 0 nhầm muốn lấy ra chỉ mục đẩu tiên để xử lý, vì phần audio chưa có bài hát nào, nhưng ngay khi app tải ra mình phải load đc bài hát đầu tiên
    currentIndex: 0,
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
        const cd =$('.cd');
        // biến cdWidth là width hiện tại của nó
        const cdWidth = cd.offsetWidth;

        // Lắng nghe event kéo
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
    },
    // Hàm load bài hát hiện tại
    loadCurrentSong: function() {
        // Biến này dùng để render tên của bài hát
        const heading = $('header h2');
        // Biến này để đổi url bài hát hiện tại
        const cdThumb = $('.cd-thumb');
        // Biến này để lấy bài hát
        const audio = $('#audio');

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
