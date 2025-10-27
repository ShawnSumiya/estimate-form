// 確認モーダルにデータを表示
function displayConfirmation(data) {
    const confirmationData = document.getElementById('confirmationData');
    
    confirmationData.innerHTML = `
        <div class="confirmation-item">
            <strong>お客様タイプ：</strong> ${data.clientType}
        </div>
        <div class="confirmation-item">
            <strong>お名前：</strong> ${data.name}
        </div>
        <div class="confirmation-item">
            <strong>LINE名：</strong> ${data.lineName || '未入力'}
        </div>
        <div class="confirmation-item">
            <strong>メールアドレス：</strong> ${data.email}
        </div>
        <div class="confirmation-item">
            <strong>Webページの種類：</strong> ${data.webpageType}
        </div>
        <div class="confirmation-item">
            <strong>ご要望：</strong> ${data.requests || '特になし'}
        </div>
        <div class="confirmation-item">
            <strong>LINEの友達追加：</strong> ${data.lineFriend ? '済み' : '未済'}
        </div>
    `;
}

// モーダルを閉じる
function closeModal() {
    document.getElementById('confirmModal').classList.remove('show');
    // フォームをリセット
    document.getElementById('estimateForm').reset();
}

// フォーム送信の処理（単一イベントリスナー）
document.getElementById('estimateForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // フォームデータの取得
    const formData = {
        clientType: document.querySelector('input[name="clientType"]:checked')?.value || '',
        name: document.getElementById('name').value,
        lineName: document.getElementById('lineName').value,
        email: document.getElementById('email').value,
        webpageType: document.getElementById('webpageType').value,
        requests: document.getElementById('requests').value,
        lineFriend: document.getElementById('lineFriend').checked
    };
    
    // バリデーション
    if (!formData.name || !formData.email || !formData.webpageType) {
        alert('必須項目を入力してください。');
        return;
    }
    
    // デバッグ用にコンソールに出力
    console.log('見積もり依頼データ:', formData);
    
    // モーダルに情報を表示
    displayConfirmation(formData);
    
    // モーダルを表示
    document.getElementById('confirmModal').classList.add('show');
    
    // 実際の運用では、ここでサーバーに送信する
    // fetch('/api/estimate', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(formData)
    // })
    // .then(response => response.json())
    // .then(data => console.log('Success:', data))
    // .catch(error => console.error('Error:', error));
});

// モーダルの背景クリックで閉じる
document.getElementById('confirmModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// リアルタイムバリデーション
document.getElementById('email').addEventListener('blur', function() {
    const email = this.value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailPattern.test(email)) {
        this.style.borderColor = '#e74c3c';
        this.style.boxShadow = '0 0 0 3px rgba(231, 76, 76, 0.2)';
    } else {
        this.style.borderColor = '#e0e0e0';
        this.style.boxShadow = 'none';
    }
});
