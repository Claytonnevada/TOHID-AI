// 🦄 TOHID-AI Plugin: AI Chat Assistantj
import fetch from 'node-fetch';

let handler = async (m, { text, conn }) => {
  // 🔍 Validate input
  if (!text && !(m.quoted && m.quoted.text)) {
    throw `🌈 *TOHID-AI*: Please provide some text or quote a message.`;
  }

  if (!text && m.quoted?.text) {
    text = m.quoted.text;
  }

  try {
    m.react('🦄'); // TOHID wait emoji
    conn.sendPresenceUpdate('composing', m.chat);

    const prompt = encodeURIComponent(text);
    const api1 = `https://api.gurusensei.workers.dev/llama?prompt=${prompt}`;

    // 🧠 Call first AI source
    const res1 = await fetch(api1);
    const data1 = await res1.json();
    const result1 = data1.response?.response;

    if (!result1) throw new Error('No response from API 1');

    await conn.sendMessage(
      m.chat,
      {
        text: `💬 *TOHID-AI Says:*\n\n${result1}\n\n✨ ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚃𝙾𝙷𝙸𝙳-𝙰𝙸`,
        image: { url: 'https://qu.ax/hJSRY.jpg' }, // Unicorn-themed image
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363207624903731@newsletter',
            newsletterName: 'TOHID-AI • 🤖 AI Results',
            serverMessageId: 143,
          },
        },
      },
      { quoted: m }
    );
    m.react('✅');
  } catch (error) {
    console.error('🛑 Primary AI failed:', error);

    // 🔁 Fallback to second API
    try {
      const api2 = `https://ultimetron.guruapi.tech/gpt3?prompt=${encodeURIComponent(text)}`;
      const res2 = await fetch(api2);
      const data2 = await res2.json();
      const result2 = data2.completion;

      await conn.sendMessage(
        m.chat,
        {
          text: `💬 *Tohid-Ai Backup AI Says:*\n\n${result2}\n\n✨ ©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚃𝙾𝙷𝙸𝙳-𝙰𝙸`,
          image: { url: 'https://qu.ax/hJSRY.jpg' },
          contextInfo: {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363207624903731@newsletter',
              newsletterName: 'TOHID-AI • 🤖 AI Backup',
              serverMessageId: 143,
            },
          },
        },
        { quoted: m }
      );
      m.react('🥳');
    } catch (error) {
      console.error('🛑 Backup AI failed:', error);
      m.react('😭');
      throw `❌ *TOHID-AI: Both sources failed to respond.*`;
    }
  }
};

handler.help = ['bro', 'chatgpt', 'ai', 'gpt', 'tohid', 'tohidai', 'tohid-ai'];
handler.tags = ['ai', 'tools'];
handler.command = ['bro', 'chatgpt', 'ai', 'gpt', 'tohid', 'tohidai', 'tohid-ai'];

export default handler;
