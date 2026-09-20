document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // Tab Switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const contentSections = document.querySelectorAll('.content-section');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            contentSections.forEach(section => {
                section.classList.remove('active');
                if (section.getAttribute('data-content') === target) {
                    section.classList.add('active');
                }
            });
        });
    });

    // Quiz functionality
    initQuizzes();
});

function initQuizzes() {
    const checkBtns = document.querySelectorAll('.check-btn');
    
    checkBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const quiz = this.closest('.test-card');
            const questions = quiz.querySelectorAll('.question');
            let score = 0;
            let total = questions.length;
            
            questions.forEach(question => {
                const options = question.querySelectorAll('.option');
                const correctAnswer = question.getAttribute('data-answer');
                let selected = false;
                
                options.forEach(option => {
                    if (option.classList.contains('selected')) {
                        selected = true;
                        if (option.getAttribute('data-value') === correctAnswer) {
                            option.classList.add('correct');
                            score++;
                        } else {
                            option.classList.add('wrong');
                        }
                    }
                    
                    if (option.getAttribute('data-value') === correctAnswer) {
                        option.classList.add('correct');
                    }
                    
                    option.style.pointerEvents = 'none';
                });
            });
            
            const scoreDisplay = quiz.querySelector('.score-display');
            if (scoreDisplay) {
                scoreDisplay.style.display = 'block';
                scoreDisplay.innerHTML = '<h3>نتيحتك: ' + score + ' / ' + total + '</h3><p>' + getScoreMessage(score, total) + '</p>';
            }
            
            this.textContent = 'تم التقييم';
            this.disabled = true;
        });
    });

    // Option Selection
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', function() {
            const question = this.closest('.question');
            question.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
}

function getScoreMessage(score, total) {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return 'ممتاز! أحسنت!';
    if (percentage >= 70) return 'جيد جداً! واصل التقدم!';
    if (percentage >= 50) return 'جيد! يمكنك التحسن أكثر.';
    return 'حاول مرة أخرى واطلع على الملخصات.';
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Topic Viewer Logic
document.addEventListener('DOMContentLoaded', function() {
    const topicViewer = document.getElementById('topicViewer');
    if (!topicViewer) return;

    let currentZoom = 100;
    let currentPage = 1;
    let totalPages = 1;
    let srcBase = "";
    let currentTitle = "";

    const openBtns = document.querySelectorAll('.open-topic');
    const closeBtn = document.getElementById('closeViewerBtn');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const zoomVal = document.getElementById('zoomVal');
    const docContainer = document.getElementById('documentContainer');
    const docImage = document.getElementById('documentImage');
    const nextBtn = document.getElementById('nextPageBtn'); // In RTL, next page means moving to page 2 (left arrow usually, but functionally it's next)
    const prevBtn = document.getElementById('prevPageBtn');
    const pageInd = document.getElementById('pageIndicator');
    const printBtn = document.getElementById('printBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const viewerTitle = document.getElementById('viewerTitle');

    function updateImage() {
        docImage.src = srcBase + currentPage;
        pageInd.textContent = `الصفحة ${currentPage} من ${totalPages}`;
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
    }

    function applyZoom() {
        docContainer.style.transform = `scale(${currentZoom / 100})`;
        zoomVal.textContent = currentZoom;
    }

    openBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            totalPages = parseInt(btn.getAttribute('data-pages')) || 1;
            srcBase = btn.getAttribute('data-src');
            currentTitle = btn.getAttribute('data-title');
            currentPage = 1;
            currentZoom = 100;
            
            viewerTitle.textContent = currentTitle;
            applyZoom();
            updateImage();
            
            topicViewer.classList.add('open');
            document.body.style.overflow = 'hidden'; // prevent background scrolling
        });
    });

    closeBtn.addEventListener('click', () => {
        topicViewer.classList.remove('open');
        document.body.style.overflow = '';
    });

    // Close on Esc key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && topicViewer.classList.contains('open')) {
            closeBtn.click();
        }
    });

    zoomInBtn.addEventListener('click', () => {
        if (currentZoom < 250) {
            currentZoom += 25;
            applyZoom();
        }
    });

    zoomOutBtn.addEventListener('click', () => {
        if (currentZoom > 50) {
            currentZoom -= 25;
            applyZoom();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            updateImage();
            document.querySelector('.viewer-body').scrollTop = 0;
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updateImage();
            document.querySelector('.viewer-body').scrollTop = 0;
        }
    });

    printBtn.addEventListener('click', () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html dir="rtl">
            <head>
                <title>${currentTitle} - طباعة</title>
                <style>
                    body { margin: 0; padding: 0; text-align: center; }
                    img { max-width: 100%; height: auto; }
                </style>
            </head>
            <body>
                <img src="${docImage.src}" onload="window.print(); window.close();" />
            </body>
            </html>
        `);
        printWindow.document.close();
    });

    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = docImage.src;
        link.download = `${currentTitle}_الصفحة_${currentPage}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});
