import { Dialog } from 'quasar'
import NotifyTool from '@/tool/notify-tool'

function showDialog(title = '提示', message = '这是一个提示信息') {
  Dialog.create({
    title: title,
    message: `<div style="max-height: calc(100vh - 320px); overflow-y: auto;">${message}</div>`,
    html: true,
    style: 'min-width: 50vw;max-width: 96vw; white-space: pre-wrap;max-height: 80vh;overflow-y: auto;',
    ok: {
      label: '复制坐标',
      color: 'primary',
    },
    cancel: {
      label: '取消',
      color: 'dark',
    },
    persistent: true,
  })
    .onOk(() => {
      // Copy the message to clipboard
      navigator.clipboard.writeText(message).then(() => {
        NotifyTool.showNotification('坐标数据已复制到剪切板', 'positive', 'top');
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    })
    .onCancel(() => {
      // console.log('Dialog canceled');
    })
    .onDismiss(() => {
      // console.log('Dialog dismissed');
    });
}

const DialogTool = {
  showDialog,
}

export default DialogTool
