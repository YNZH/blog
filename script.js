// 获取页面元素
var input = document.getElementById("input");
var output = document.getElementById("output");
var feedback = document.getElementById("feedback");
var sendButton = document.getElementById("send");
var cw = document.getElementById("chat-window");

// 发送消息
function sendMessage() {
    var message = input.value;
    if (message.trim() !== "") {
        output.innerHTML += '<div class="user">' + message + '</div>';
        feedback.innerHTML = '<div class="feedback">Bot is typing...</div>';
        
        // 发送请求并获取回复
        // 这里可以通过调用后端API获取回复消息
        
        // 模拟延迟
        getReply(message);
        
    }
}

function setReply(data) {
  output.innerHTML += '<div class="bot">Bot: ' + data + '</div>';
            feedback.innerHTML = "";
            scrollToBottom();
input.value = "";
}

// 获取回复消息（这里只是一个简单的示例，实际使用时需要根据后端API进行修改）
function getReply(message) {
    //var replies = ["Hello!", "How are you?", "Nice to meet you!"];
   // return replies[Math.floor(Math.random() * replies.length)];

ajax('https://api.openai.com/v1/chat/completions', 30000, function(error, response) {
  if (error) {
    console.log(error.message);
    setReply(message);
    return "error";
  } else {
    console.log(response);
    var ret = JSON.parse(response);
    setReply(ret.choices[0].message.content);
    return response;
  }
},{"model": "gpt-3.5-turbo", "temperature": 0.7, "messages": [{"role": "user", "content": message}]});
}

// 滚动到底部
function scrollToBottom() {
    //output.scrollTop = output.scrollHeight;
    cw.scrollTop = cw.scrollHeight;

}

// 绑定发送按钮点击事件
sendButton.addEventListener("click", sendMessage);

// 绑定输入框回车键事件
input.addEventListener("keydown", function(event) {
    if (event.keyCode === 13) {
        sendMessage();
    }
});

function ajax(url, timeout, callback, data) {
  var xhr = new XMLHttpRequest();

  var timer;

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      clearTimeout(timer);
      if (xhr.status === 200) {
        callback(null, xhr.responseText);
      } else {
        callback(new Error('Request failed. Status: ' + xhr.status));
      }
    }
  };

  xhr.open('POST', url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Authorization", "Bearer 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");
  xhr.timeout = timeout;

  xhr.ontimeout = function() {
    callback(new Error('Request timed out'));
  };

  xhr.send(JSON.stringify(data));

  timer = setTimeout(function() {
    xhr.abort();
    callback(new Error('Request timed out'));
  }, timeout);
}