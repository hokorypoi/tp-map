import { Notify } from 'quasar'

function showNotification(message = '这是一个通知信息', color = 'primary', position = 'top') {
  Notify.create({
    message: message,
    color: color,
    position: position,
  });
}

const NotifyTool = {
  showNotification,
};

export default NotifyTool;
