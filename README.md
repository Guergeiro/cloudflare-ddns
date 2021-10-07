# cloudflare-ddns

Automatically update cloudflare A records to work like a ddns

## Purpose

During my life, I've jumped from one
[ISP](https://en.wikipedia.org/wiki/Internet_service_provider) to another, as
many people do, in search of either for better prices, quality of services or
any other reasons that one might have.

Of course, this comes with a problem for those who use their home public IP
address for various reasons. I, for example, use it as my
[VPN](https://en.wikipedia.org/wiki/Virtual_private_network) when I require it
or as my own private "cloud". For these kind of people, having a static IP
address is important, but sometimes, either by virtue of the hoping back and
forth between providers or because the ability of having a static IP address is
behind a paywall, one can find himself always needing to know what the current
public address is. The solution? Using a domain that points to that IP!

Okay, we have a domain. But that's only a point of indirection; it doesn't solve
anything! Yes, I point a domain to the IP, but what happens if the IP changes? I
need to go to the [DNS](https://en.wikipedia.org/wiki/Domain_Name_System)
provider and update it with my current IP address. But the address can still
change... But! I present you [DDNS](https://en.wikipedia.org/wiki/Dynamic_DNS)!

Most modern routers, that the ISP installs when you hire their services, come
with a setting that allows for DDNS out of the box. But there's a "catcha"; you
are only allowed to use the implementations they prepared the router for.
Normally those are [noip](https://www.noip.com/),
[cloudns](https://www.cloudns.net/) and many [others](https://is.gd/xcO7Kx).
That's a good solution for most people, except for two main reasons:

1. You change the router and the new one doesn't have the implementation with
   the previous DDNS.
2. You already have a DNS provider and you wish to keep under the same domain.

So yeah, I'm point number 2. And my DNS provider is
[Cloudflare](https://www.cloudflare.com/) hence the purpose of this script.

## Table of Contents

- [Install](#install)
- [Using It](#using)
- [As a dependency](#dependency)

### Install

#### Binary

Head to the [Releases](https://github.com/Guergeiro/cloudflare-ddns/releases)
and download the binary and run it.

#### Deno

Either clone this repository or get the source code from the
[Releases](https://github.com/Guergeiro/cloudflare-ddns/releases).

_Optional:_ `deno install --allow-net --allow-read --allow-write lib/main.ts`

### Using

Firstly you require a config file. Here's an example:

```
x-auth-email=your@email.com
x-auth-key=123your123auth123key
zone-id=123your123zone123id
a-record=test
```

Then you need to run the script like this:

```
cloudflare-ddns --config path/to/my/config
```

### Dependency

You can also this as a dependency of your Deno scripts. Take a look at the what
it [exports](./mod.ts).

```ts
import { CloudflareDns, CloudflareDnsError, CloudflareDnsVersion } from "mod.ts"

console.log(`The current version is ${version}`).

const myConfig = "path/to/my/config"

CloudflareDns(myConfig).then(function () {
  console.log("We ran successfully");
}).catch(function (error) {
  if (error instanceof CloudflareDnsError) {
    // Module error
  } else {
    // Generic error
  }
});
```
