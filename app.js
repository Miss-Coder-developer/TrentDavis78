// Require the necessary discord.js classes
const { 
    Client, 
    Intents,
	MessageEmbed
} = require('discord.js');
const { token } = require('./config.json');


const { Api, JsonRpc } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');
const fetch = require('node-fetch');
const { TextDecoder, TextEncoder } = require('util'); 

const privateKeys = [];

const signatureProvider = new JsSignatureProvider(privateKeys);
const rpc = new JsonRpc('https://e016-185-177-104-132.ngrok.io/', { fetch }); //required to read blockchain state
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() }); //required to submit transactions


// 	userAccount: 'pyzn4.c.wam',
var wax = {
	userAccount: 'pyzn4.c.wam'
}



// Create a new client instance
const client = new Client({ intents: [
	Intents.FLAGS.GUILDS, 
	Intents.FLAGS.GUILD_PRESENCES, 
	Intents.FLAGS.GUILD_MEMBERS,
	Intents.FLAGS.GUILD_MESSAGES, 
	Intents.FLAGS.DIRECT_MESSAGES
] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
    console.log(token);
});


// messageCreate event
client.on('messageCreate', message => {
	console.log(message.content);

	if (message.content === "$help__") {
		message.reply({ embeds: [helpEmbed] });
	}
	
	if (message.content === "$withdraw__") {
		message.reply({ embeds: [withdrawEmbed] });
	}

	if (message.content === "$deposit__") {
		message.reply({ embeds: [withdrawEmbed] });
	}

	if (message.content === "$waxairdrop__") {
		message.reply({ embeds: [withdrawEmbed] });
	}

	if (message.content === "$waxtip_bal__") {
		message.reply({ embeds: [withdrawEmbed] });
	}

	if (message.content === "$waxtip") {
		tipWax();
	}

});

const tipWax = async (to, amount) => {
	const result = await api.transact({
		actions: [{
		account: 'eosio.token',
		name: 'transfer',
		authorization: [{
			actor: wax.userAccount,
			permission: 'active',
		}],
		data: {
			from: wax.userAccount,
			to: 'eosio',
			quantity: '0.01 WAX',
			memo: '',
		},
		}]
	}, {
		blocksBehind: 3,
		expireSeconds: 30,
	});
	console.dir(result);
}

const getIransactionInfo = async (transaction) => {
	await rpc.history_get_transaction(transaction, 46632826)
}

const stack = async (to, amount) => {
	await api.transact({
		actions: [{
		  account: 'eosio',
		  name: 'delegatebw',
		  authorization: [{
			actor: wax.userAccount,
			permission: 'active',
		  }],
		  data: {
			from: wax.userAccount,
			receiver: 'mynewaccount',
			stake_net_quantity: '0.01 WAX',
			stake_cpu_quantity: '0.01 WAX',
			transfer: false,
		  }
		}]
	  }, {
		blocksBehind: 3,
		expireSeconds: 30,
	  });
}

const unstack = async (to, amount) => {
	await api.transact({
		actions: [{
		  account: 'eosio',
		  name: wax.userAccount,
		  authorization: [{
			actor: 'pyzn4.c.wam',
			permission: 'active',
		  }],
		  data: {
			from: wax.userAccount,
			receiver: 'mynewaccount',
			stake_net_quantity: '0.01 WAX',
			stake_cpu_quantity: '0.01 WAX',
			transfer: false,
		  }
		}]
	  }, {
		blocksBehind: 3,
		expireSeconds: 30,
	  });
}

const deploySmart = async (to, amount) => {
	await api.transact({
		actions: [
			{
			account: 'eosio',
			name: 'setcode',
			authorization: [
				{
				actor: wax.userAccount,
				permission: 'active',
				},
			],
			data: {
				account: wax.userAccount,
				code: wasmHexString,
			},
			},
			{
			account: 'eosio',
			name: 'setabi',
			authorization: [
				{
				actor: wax.userAccount,
				permission: 'active',
				},
			],
			data: {
				account: wax.userAccount,
				abi: serializedAbiHexString,
			},
			},
		],
		},
		{
		blocksBehind: 3,
		expireSeconds: 30,
		});
}



// interactions
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;
	const channel = interaction.channel;

	if (commandName === 'wax') {
        console.log('channel -- ', interaction.channel);
        console.log('channelId -- ', interaction.channel.id);

        await interaction.reply(`
			Server name: ${interaction.guild.name}\n
			Total members: ${interaction.guild.memberCount}\n
			Your tag: ${interaction.user.tag}\n
			Your id: ${interaction.user.id}
		`);
        
	}

});

// embeds
const helpEmbed = new MessageEmbed()
	.setColor('#0099ff')
	.setTitle(':wave: Introduction')
	.setDescription('tip.dd is a bot that allows you to tip and make payments to any Discord user with your favorite cryptocurrency. \n See $currencies for a full list of 514 cryptocurrencies it supports!')
	.addField('tip.dd is free to use.', "Tips are free of fees. The only fees are the withdrawal network fees, required by every cryptocurrency, and deposit fees for some. We don't influence or regulate those fees.", false)
	.addField('tip.dd is easy to use.', "$tip @oknu $1 – that's how simple sending crypto is. You can even send tips and payments like 3 BTC, one cup of coffee and a donut, half a pizza or 2 months of discord nitro — tip.cc will understand and convert your tip! See $monikers for a list of the values supported. See the 💰 Wallet page for more information on tips.If you don't have any cryptocurrency, try $faucet to receive a small amount to play with.", false)
	.addField(`tip.dd is a cryptocurrency investor's and miner's best friend.`, `tip.cc is not only for tipping. It comes with a set of extra commands every investor and miner will appreciate. Try commands like $ticker for pricing information of any currency, or $pools or $mining for mining stats.`, false)
	.addField(`tip.dd powers many communities.`, `Join one of many public servers running tip.cc - use the $servers command to view the server catalog, join and get rewarded for your activity!`, false)
	.addFields(
		{ name: 'Website', value: 'Some value here', inline: true },
		{ name: 'Support server', value: 'Some value here', inline: true },
		{ name: 'Coin prices provided by', value: 'Some value here', inline: true },
	)
	// .addField(``, ``, false)

const withdrawEmbed = new MessageEmbed()
	.setColor('#0099ff')
	.setTitle(':arrow_heading_up: Withdrawal - help ')
	.addField(`Send coins to an address.`, `Instant withdrawal wizard. You will be asked for the address and the amount you want to withdraw.\n A network fee will be added on top of your withdrawal (or deducted if you can't afford it). You will be asked to confirm it.`, false)
	.addField(`\u200b`, `To withdraw use $withdraw <cryptocurrency>, for example $withdraw BTC.`, false)
	.addField(`\u200b`, `You can also send a picture of a QR code via a DM to the bot to have it scanned and the payment details filled out.`, false)
	

// Login to Discord with your client's token
client.login(token);