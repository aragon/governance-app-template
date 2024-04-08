# Aragonette 🚀

Welcome to **Aragonette**, the sleek and snappy UI template designed for lightning-fast prototyping with Aragon DAOs and plugins! Built with the power of Next.js and the speed of Bun.js, Aragonette is your go-to toolkit for bringing your Aragon DAO visions to life with style and efficiency. 🎨✨

## Getting Started 🏁

Before you dive into the world of DAOs and decentralized governance, make sure you have Bun installed on your machine. If not, hop over to [Bun's official documentation](https://bun.sh/) for installation instructions.

Once you're set with Bun, clone this repository to your local machine:

```bash
git clone https://github.com/your-repo/aragonette.git
cd aragonette
```

To get the development server running, simply execute:

```bash
bun install
bun dev
```

And voilà! You're now in the fast lane to DAO prototyping. 🌟

## Adding Your Plugin 🧩

Got a plugin idea that's going to revolutionize the Aragon ecosystem? Adding it to Aragonette is as easy as pie:

1. **Duplicate a Plugin Directory**: Navigate to the `/plugins` directory, pick a plugin that closely resembles your idea, and duplicate its directory.
2. **Rename Your Plugin**: Give your plugin a unique and catchy name that captures its essence.
3. **Register Your Plugin**: Open the `index.tsx` file inside the `/plugins` directory and add an entry for your new plugin.

And that's it! Your plugin is now part of the Aragonette universe. 🌌

## Leveraging Aragon OSx Primitives 🛠

Aragonette is built to work seamlessly with Aragon OSx primitives, such as `IProposal` or `MajorityVoting`. This means you can focus on the fun part of creating and experimenting, without sweating the small stuff. Your plugin should integrate smoothly into the UI, making your development journey as breezy as a blockchain. 😉

## Contributing 🤝

Got ideas on how to make Aragonette even better? We're all ears! Whether it's a bug fix, a new feature, or a plugin that could benefit everyone, we welcome your contributions. Check out our [contributing guidelines](CONTRIBUTING.md) for more information on how to get involved.

### You can configure your repository to pull changes from this repository with:
```bash
git remote add upstream git@github.com:aragon/aragonette.git
git remote set-url --push upstream DISABLE
```

## Need Help? 🆘

Stuck on something? Our community is here to help! Join our [Discord channel](https://discord.com/invite/eqQJkdp) for support, advice, or just to share your awesome plugin creations with fellow Aragon enthusiasts.

## License 📜

Aragonette is released under the AGPL v3 License.

---

Happy prototyping! With Aragonette, the future of decentralized organizations is in your hands. Let's build something amazing together! 🚀🌈
