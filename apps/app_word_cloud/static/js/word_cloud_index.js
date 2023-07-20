/**何恺悦 hekaiyue 2023-07-19 */

const main_div = document.getElementById('main_div');
/**输入文本 */
const text_paste_button = document.getElementById('text_paste_button');
const text_clear_button = document.getElementById('text_clear_button');
const text_textarea = document.getElementById('text_textarea');
/**用户词典 */
const user_dict_paste_button = document.getElementById('user_dict_paste_button');
const user_dict_clear_button = document.getElementById('user_dict_clear_button');
const user_dict_textarea = document.getElementById('user_dict_textarea');
/**词云背景 词云形状 词云尺寸*/
const current_bg = document.getElementById('current_bg');
const default_bg_button = document.getElementById('default_bg_button');
const select_bg = document.getElementById('select_bg'); 
const select_bg_button = document.getElementById('select_bg_button'); select_bg_button.addEventListener('click', () => {select_bg.click();});
const current_mask = document.getElementById('current_mask');
const default_mask_button = document.getElementById('default_mask_button');
const select_mask = document.getElementById('select_mask'); 
const select_mask_button = document.getElementById('select_mask_button'); select_mask_button.addEventListener('click', () => {select_mask.click();});
const width = document.getElementById('width'); const height = document.getElementById('height');
/**词云颜色*/
const h_lower = document.getElementById('h_lower'); const h_upper = document.getElementById('h_upper');
const s_lower = document.getElementById('s_lower'); const s_upper = document.getElementById('s_upper');
const l_lower = document.getElementById('l_lower'); const l_upper = document.getElementById('l_upper');
/**单次生成数量 */
const generate_number = document.getElementById('generate_number');
const apply_button = document.getElementById('apply_button');
const generate_button = document.getElementById('generate_button');
/**文件列表 */
const deleteFile_button = document.getElementById('deleteFile_button');
const selectallFile_button = document.getElementById('selectallFile_button');
const downloadFile_button = document.getElementById('downloadFile_button');
const files_ul = document.getElementById('files_ul');
/**词云预览 */
const last_button = document.getElementById('last_button');
const next_button = document.getElementById('next_button');
const wordcloud_canvas = document.getElementById('wordcloud_canvas');

const status_popup_div = document.getElementById('status_popup_div');
const status_popup_label = document.getElementById('status_popup_label');

const identification_code = Math.floor(Math.random() * 9000000) + 1000000;
var apply_json = {};

function status_popup(seconds, text) {
    status_popup_label.textContent = text;
    status_popup_div.style.display = 'flex';
    main_div.style.pointerEvents = 'none';
    setTimeout(() => {  // 几秒后关闭悬浮窗 复原主屏幕
        /**
         * 解除全局事件禁用
         * 隐藏状态弹窗
         */
        main_div.style.pointerEvents = 'auto';
        status_popup_div.style.display = 'none';
    }, seconds*1000);
}

select_bg.addEventListener('change', (event) => {
    let selected_files_number = event.target.files.length;
    if (selected_files_number === 0) {status_popup(0.5, "未选择文件"); return;}
    if (selected_files_number >= 2) {status_popup(0.5, "选择文件过多"); return;}

    let file = event.target.files[0];
    let reader = new FileReader();
    reader.onload = function() {
        let binaryData = reader.result; let base64Data = btoa(binaryData);
        apply_json["bg"] = base64Data;
        current_bg.innerHTML = "已上传";
    };
    reader.readAsBinaryString(file);
});
select_mask.addEventListener('change', (event) => {
    let selected_files_number = event.target.files.length;
    if (selected_files_number === 0) {status_popup(0.5, "未选择文件"); return;}
    if (selected_files_number >= 2) {status_popup(0.5, "选择文件过多"); return;}

    let file = event.target.files[0];
    let reader = new FileReader();
    reader.onload = function() {
        let binaryData = reader.result; let base64Data = btoa(binaryData);
        apply_json["mask"] = base64Data;
        current_mask.innerHTML = "已上传";
    };
    reader.readAsBinaryString(file);
});

function check_apply() {
    if (text_textarea.value === '') {text_textarea.value = 'hello world!';}
    if (user_dict_textarea.value === '') {user_dict_textarea.value = 'hello\nworld';}
    if (select_bg.value === '') {apply_json["bg"] = "default";}
    if (select_mask.value === '') {apply_json["mask"] = "default";}

    if (width.value === '' || parseInt(width.value, 10) > 1920) {width.value = '1920';} 
    if (parseInt(width.value, 10) < 640) {width.value = '640';}
    if (height.value === '' || parseInt(width.value, 10) > 1080) {height.value = '1080';}
    if (parseInt(width.value) < 360) {width.value = '360';}

    if (h_lower.value === '' || parseInt(h_lower.value, 10) < 0) {h_lower.value = '0';} 
    if (h_upper.value === '' || parseInt(h_upper.value, 10) > 360) {h_upper.value = '360';}
    if (parseInt(h_lower.value, 10) > parseInt(h_upper.value, 10)) {h_lower.value = h_upper.value;}

    if (s_lower.value === '' || parseInt(s_lower.value, 10) < 0) {s_lower.value = '0';} 
    if (s_upper.value === '' || parseInt(s_upper.value, 10) > 100) {s_upper.value = '100';}
    if (parseInt(s_lower.value, 10) > parseInt(s_upper.value, 10)) {s_lower.value = s_upper.value;}

    if (l_lower.value === '' || parseInt(l_lower.value, 10) < 0) {l_lower.value = '0';} 
    if (l_upper.value === '' || parseInt(l_upper.value, 10) > 100) {l_upper.value = '100';}
    if (parseInt(l_lower.value, 10) > parseInt(l_upper.value, 10)) {l_lower.value = l_upper.value;}
}

function apply() {
    /**
     * 生成一个配置json信息
     * 
     */
    check_apply()
    apply_json["identification_code"] = identification_code;
    apply_json["text"] = text_textarea.value;
    apply_json["user_dict"] = user_dict_textarea.value;
    apply_json["size"] = [parseInt(width.value), parseInt(height.value)];
    apply_json["h_range"] = [parseInt(h_lower.value), parseInt(h_upper.value)];
    apply_json["s_range"] = [parseInt(s_lower.value), parseInt(s_upper.value)];
    apply_json["l_range"] = [parseInt(l_lower.value), parseInt(l_upper.value)];

    status_popup_label.textContent = "设置应用中...";
    status_popup_div.style.display = 'flex';
    main_div.style.pointerEvents = 'none';

    fetch('/word_cloud/apply/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(apply_json)
    })
    .then(response => response.json())
    .then(data => {
        setTimeout(() => {  // 几秒后关闭悬浮窗 复原主屏幕
            /**
             * 解除全局事件禁用
             * 隐藏状态弹窗
             */
            main_div.style.pointerEvents = 'auto';
            status_popup_div.style.display = 'none';
        }, 1000);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function generate() {
    let times = parseInt(generate_number.value);
    console.info(times);
}
















text_paste_button.addEventListener('click', function() {
    navigator.clipboard.readText()
    .then(text => {
        text_textarea.value = text;
        status_popup(0.5, `已成功粘贴文本`);
    })
    .catch(err => {
        status_popup(0.5, `读取剪贴板时出错`);
    });
});
user_dict_paste_button.addEventListener('click', function() {
    navigator.clipboard.readText()
    .then(text => {
        user_dict_textarea.value = text;
        status_popup(0.5, `已成功粘贴文本`);
    })
    .catch(err => {
        status_popup(0.5, `读取剪贴板时出错`);
    });
});

$("#text_paste_button").click(function() {});
$("#text_clear_button").click(function() {});

$("#user_dict_paste_button").click(function() {});
$("#user_dict_clear_button").click(function() {});

$("#default_bg_button").click(function() {current_bg.innerHTML = "无背景"; apply_json["bg"] = "default";});
$("#default_mask_button").click(function() {current_mask.innerHTML = "无形状"; apply_json["mask"] = "default";});
$("#select_button").click(function() {});
$("#apply_button").click(function() {apply();});
$("#generate_button").click(function() {generate();});

$("#deleteFile_button").click(function() {});
$("#selectallFile_button").click(function() {});
$("#downloadFile_button").click(function() {});

$("#last_button").click(function() {});
$("#next_button").click(function() {});
