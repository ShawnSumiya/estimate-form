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
    const lineFriendCheckbox = document.getElementById('lineFriend');
    const lineFriendValidator = document.getElementById('lineFriendValidator');
    
    // まずブラウザの標準バリデーションをチェック
    if (!this.checkValidity()) {
        return;
    }
    
    // LINEの友達追加チェックのカスタムバリデーション
    if (!formData.lineFriend) {
        lineFriendValidator.setAttribute('required', 'required');
        lineFriendValidator.setCustomValidity('友達追加の上チェックしてください');
        lineFriendValidator.reportValidity();
        return;
    }
    lineFriendValidator.removeAttribute('required');
    lineFriendValidator.setCustomValidity('');
    
    // デバッグ用にコンソールに出力
    console.log('1️⃣ 見積もり依頼データ:', formData);
    
    // Formspreeに送信（無料プランあり）
    console.log('2️⃣ Formspreeエンドポイントを設定...');
    const formspreeEndpoint = 'https://formspree.io/f/xanlnzoa';
    
    // フォームデータをFormData形式に変換
    console.log('3️⃣ FormDataを作成中...');
    const formDataToSend = new FormData();
    formDataToSend.append('clientType', formData.clientType);
    formDataToSend.append('name', formData.name);
    formDataToSend.append('lineName', formData.lineName);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('webpageType', formData.webpageType);
    formDataToSend.append('requests', formData.requests || '特になし');
    formDataToSend.append('lineFriend', formData.lineFriend ? '済み' : '未済');
    formDataToSend.append('_replyto', formData.email);
    formDataToSend.append('_subject', `【Web制作依頼】${formData.name}様からのご依頼`);
    console.log('4️⃣ FormData作成完了');
    
    // メール送信
    console.log('5️⃣ Formspreeに送信開始...');
    console.log('エンドポイント:', formspreeEndpoint);
    
    fetch(formspreeEndpoint, {
        method: 'POST',
        body: formDataToSend,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(async response => {
        console.log('📡 レスポンス受信 - ステータス:', response.status);
        
        let responseData;
        try {
            responseData = await response.text();
            console.log('レスポンス本文:', responseData);
        } catch (e) {
            responseData = 'レスポンスの解析に失敗しました';
        }
        
        if (response.ok) {
            console.log('✅ メール送信成功！');
            console.log('送信内容:', formData);
            // モーダルに情報を表示
            displayConfirmation(formData);
            // モーダルを表示
            document.getElementById('confirmModal').classList.add('show');
        } else {
            console.error('❌ 送信失敗');
            console.error('ステータス:', response.status);
            console.error('レスポンス:', responseData);
            alert(`メール送信に失敗しました。\nステータス: ${response.status}\n\n詳細はコンソールをご確認ください。`);
        }
    })
    .catch(error => {
        console.error('❌ ネットワークエラー');
        console.error('エラー詳細:', error);
        alert(`メール送信に失敗しました。\nエラー: ${error.message}\n\nコンソールをご確認ください。`);
    });
    
    console.log('⏳ 送信処理中...');
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

// LINE友達追加チェックボックスのバリデーション
document.getElementById('lineFriend').addEventListener('change', function() {
    const validator = document.getElementById('lineFriendValidator');
    if (this.checked) {
        validator.removeAttribute('required');
        validator.setCustomValidity('');
    } else {
        validator.setAttribute('required', 'required');
    }
});
