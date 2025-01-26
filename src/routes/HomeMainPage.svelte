<script>
	import { onMount } from 'svelte';
	import { Button, ButtonGroup, Heading, P, Popover, Span } from 'flowbite-svelte';
	import { user } from '../stores/auth';

	// export let info;

	onMount(async () => {
		localStorage.clear();
		//   const targetId = wholeWebsiteData.findIndex(item => item.id === "allinfo");
		// 		if (targetId > -1) {
		// 			const allInfo = wholeWebsiteData[targetId].info;
		// 			for (let i = 0; i < allInfo.length; i++) {
		// 				if (allInfo[i].id == "homepage") { info = allInfo[i].info; }
		// 			}
		// 		} else {
		// 			const allInfo = await getCollection("AllInfo");
		// 			updateWholeWebsiteData("allinfo", allInfo);
		// 		}

		// console.log(info);
	});
</script>

<div class="wholerapper bg-gray-100" style="height: 100%;">
	<div class="maincontainer bg-gray-100" style="height: 100%;">
		<!-- This shouldn't be hard-coded! (Will fix later on.) -->
		<div class="infocontainer">
			<div class="specinfo" id="maintitleinfo">
				<div class="spectext" id="titlespectext">
					<div class="spectitletext">
						<Heading tag="h1" class="mb-4">
							CRLS <Span
								underline
								decorationClass="decoration-8 decoration-red-800 dark:decoration-red-600"
								>PathFinders</Span
							>
						</Heading>
						<br />
						<P size="2xl">
							<i>
								Bringing autonomy back to the students, PathFinders seeks to provide 9th and 10th
								grade students with all of the resources that CRLS and Cambridge have to offer! (<u
									><a
										target="_blank"
										href="https://docs.google.com/document/d/1YI2v0bbCvRPl7p3QwTcCgFys6XdEaYL5b8neRynenPI/edit?tab=t.0"
										>read more about our mission statement here</a
									></u
								>)
								<!-- <Hr classHr="w-48 h-1 mx-auto my-4 rounded md:my-15 bg-gray-500" /> -->
							</i>
							<br />
						</P>
						<P size="xl">Scroll below to learn more about what our program offers.</P>
						<P size="lg">
							Need help navigating the site? Check out our <u
								><i
									><a
										target="_blank"
										href="https://docs.google.com/document/d/1KE2f7uTJbHAJTiiC_QR9EC_LPuOrgRl2xr2qtWoNaeo/edit?tab=t.5r4w0ql12kpq#heading=h.hc7xo7n755y3"
										>ultimate guide</a
									></i
								></u
							>.
						</P>
					</div>
				</div>
				<!-- <div class="specimg">
          <img width="300rem" src="https://firebasestorage.googleapis.com/v0/b/crlspathfinders-82886.appspot.com/o/other-images%2Fempowering-removebg-preview.png?alt=media&token=99a65cff-6c60-4d47-8d59-559a2be1b7d0" alt="PathFinders Logo">
        </div> -->
			</div>

			<div class="specinfo" id="mentorinfo">
				<div class="specimg" id="mentorimg">
					<img
						src="https://firebasestorage.googleapis.com/v0/b/crlspathfinders-82886.appspot.com/o/other-images%2F4-removebg-preview.png?alt=media&token=2180129f-5c8d-4a6d-b5d8-adc0edaa8e77"
						alt="mentor"
					/>
				</div>
				<div class="spectext" id="mentortext">
					<P size="lg">
						<center>
							Whether you're having trouble in a class, preparing for an upcoming exam, or just need
							some guidance on high school, you can connect to and pair with one of our mentors.
							<br />
							Message someone who you best believe matches your interests and can help you support your
							academic or career goals.
							<br /><br />
							<Button outline color="red"><a href="/findamentor">Explore Mentors</a></Button>
						</center>
					</P>
				</div>
			</div>

			<div class="specinfo" id="clubinfo">
				<div class="spectext" id="clubtext">
					<P size="lg">
						<center>
							Find different clubs that suit your interests. Ranging from sports, to drones, to art,
							to culture, there are so many different clubs available at our school!
							<br /><br />
							<Button outline color="red"><a href="/findaclub">Explore Clubs</a></Button>
						</center>
					</P>
				</div>
				<div class="specimg" id="clubimg">
					<img
						src="https://firebasestorage.googleapis.com/v0/b/crlspathfinders-82886.appspot.com/o/other-images%2F5-removebg-preview.png?alt=media&token=2f819424-e89d-42a0-8f45-17f7a387a9cb"
						alt="club"
					/>
				</div>
			</div>

			<div class="specinfo" id="pmlinfo">
				<div class="specimg" id="mentorimg">
					<img
						src="https://firebasestorage.googleapis.com/v0/b/crlspathfinders-82886.appspot.com/o/other-images%2F6-removebg-preview.png?alt=media&token=9d2a7327-21d8-4d64-8b76-b6cd30ac61ea"
						alt="opportunities"
					/>
				</div>
				<div class="spectext" id="pmltext">
					<P size="lg">
						<center>
							Looking for opportunities in CRLS or Cambridge? Check out our list of available
							opportunities to see which one catches your eye!
							<br />
							Also keep an eye on this page for peer-shadowing. Once course selection rolls around, you
							are able to shadow a class you might be interested in taking.
							<br /><br />
							<Button outline color="red"><a href="/opportunities">Explore Opportunities</a></Button
							>
						</center>
					</P>
				</div>
			</div>

			<div class="specinfo" id="helpoutinfo">
				<div class="spectext" id="helpouttext">
					<P size="lg">
						<center>
							Want to help out? Want to become a mentor and earn community service hours, or get
							your club registered on the site?
							<br />
							Follow the links below!
							<br /><br />
							<ButtonGroup>
								{#if $user}
									<Button outline color="red"><a href="/becomeamentor">Become a mentor</a></Button>
									<Button outline color="red"><a href="/registeryourclub">Register club</a></Button>
								{:else}
									<Popover
										class="w-64 text-sm font-light "
										title="Make an account first!"
										triggeredBy="#disabledbecomeamentorbutton"
									>
										<p class="text-gray-800">
											You can only become a mentor when you have an account!
											<br /><br />
											<u><a href="/auth/login">Log in</a></u> or
											<u><a href="/auth/signup">Sign up</a></u>
										</p>
									</Popover>
									<Button disabled outline color="red" id="disabledbecomeamentorbutton"
										>Become a mentor</Button
									>
									<Popover
										class="w-64 text-sm font-light "
										title="Make an account first!"
										triggeredBy="#disabledregisterclubbutton"
									>
										<p class="text-gray-800">
											You can only register a club when you have an account!
											<br /><br />
											<u><a href="/auth/login">Log in</a></u> or
											<u><a href="/auth/signup">Sign up</a></u>
										</p>
									</Popover>
									<Button disabled outline color="red" id="disabledregisterclubbutton"
										>Register club</Button
									>
								{/if}
							</ButtonGroup>
						</center>
					</P>
				</div>
				<div class="specimg" id="mentorimg">
					<img
						src="https://firebasestorage.googleapis.com/v0/b/crlspathfinders-82886.appspot.com/o/other-images%2Fthe_best_pathfinder_icons_found_by_urbana-removebg-preview.png?alt=media&token=c61646b4-d481-4975-908d-0c950332f75a"
						alt="helpout"
					/>
				</div>
			</div>

			<div class="specinfo" id="contactinfo">
				<div class="specimg" id="contactimg">
					<!-- <img src="https://firebasestorage.googleapis.com/v0/b/crlspathfinders-82886.appspot.com/o/other-images%2F3-removebg-preview.png?alt=media&token=2289e9bf-8c24-4c99-80ca-9eed0d804232" alt="Contact Us"> -->
					<img
						src="https://firebasestorage.googleapis.com/v0/b/crlspathfinders-82886.appspot.com/o/other-images%2Fthe_best_pathfinder_icons_found_by_urbana__1_-removebg-preview.png?alt=media&token=6e3daaee-d808-44b4-ad50-c4d3168ced83"
						alt="Contact Us"
					/>
				</div>
				<div class="spectext" id="contacttext">
					<P size="lg">
						<center>
							Need help with features on the site? Mentors not responding? Can't find the page
							you're looking for?
							<br />
							Contact us! Our email is
							<u
								><a
									target="_blank"
									href="https://mail.google.com/mail/?view=cm&fs=1&to=crlspathfinders25@gmail.com&su=CRLS%20PathFinders%20Support"
									>crlspathfinders25@gmail.com</a
								></u
							>.
							<br /><br />
							<Button outline color="red"
								><a
									target="_blank"
									href="https://mail.google.com/mail/?view=cm&fs=1&to=crlspathfinders25@gmail.com&su=CRLS%20PathFinders%20Support"
									>Send us an email</a
								></Button
							>
						</center>
					</P>
				</div>
			</div>

			<div class="specinfo" id="contributeinfo">
				<div class="spectext" id="contacttext">
					<P size="lg">
						<center>
							CRLS PathFinders is a student developed and maintained website. Want to help us out
							and contribute to the project?
							<br />
							Follow the links below to our GitHub repositories. Feel free to look around, whether you're
							experienced or not!
							<br /><br />
							<ButtonGroup>
								<Button outline color="red"
									><a target="_blank" href="https://github.com/Rehaan12345/crlspathfinders_frontend"
										>Frontend</a
									></Button
								>
								<Button outline color="red"
									><a target="_blank" href="https://github.com/Rehaan12345/crlspathfinders_backend"
										>Backend</a
									></Button
								>
							</ButtonGroup>
						</center>
					</P>
				</div>
				<div class="specimg" id="contributeimg">
					<img
						src="https://firebasestorage.googleapis.com/v0/b/crlspathfinders-82886.appspot.com/o/other-images%2F3-removebg-preview.png?alt=media&token=2289e9bf-8c24-4c99-80ca-9eed0d804232"
						alt="Contribute"
					/>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.maincontainer {
		padding: 2rem;
		height: 200vh;
		/* background-image: url("https://firebasestorage.googleapis.com/v0/b/crlspathfinders-82886.appspot.com/o/other-images%2Fdotpattern.jpg?alt=media&token=6fa7730e-931d-413d-9ee2-271ac07d6661"); */
		/* background-color: #aac2bd; */
	}

	.infocontainer {
		margin-top: 1rem;
		padding: 1rem;
		height: 100%;
	}

	.specinfo {
		border: 2px dotted brown;
		border-radius: 15px;
		margin-bottom: 2rem;
		display: flex;
		justify-content: space-evenly;
	}

	.spectext {
		padding: 2rem;
		display: flex;
		justify-content: center;
		align-items: center;
		max-width: 50%;
	}

	.specimg {
		max-width: 30%;
		max-height: 20%;
		min-width: 10%;
		min-height: 20%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	#maintitleinfo {
		border: 0px solid black;
		border-radius: 0;
		margin-bottom: 2rem;
		margin-top: -10;
		/* display: flex; */
		justify-content: left;
	}

	#titlespectext {
		padding: 0;
		max-width: 100%;
	}

	@media (max-width: 768px) {
		.maincontainer {
			padding: 1.5rem;
			height: 150vh;
		}

		.infocontainer {
			margin-top: 0.8rem;
			padding: 0.8rem;
		}

		.spectext {
			max-width: 70%;
		}

		.specimg {
			display: flex;
			justify-content: center;
			align-items: center;
			max-width: 40%;
		}

		/* #becomeamentorbutton {
    margin-bottom: 1rem;
  } */
	}

	/* Small screens (mobile) */
	@media (max-width: 480px) {
		.maincontainer {
			padding: 1rem;
			height: 100vh;
			background-position: top;
		}

		.infocontainer {
			margin-top: 0.5rem;
			padding: 0.5rem;
		}

		.specinfo {
			flex-direction: column;
			align-items: center;
		}

		.spectext {
			padding: 1rem;
			max-width: 100%;
		}

		.specimg {
			display: flex;
			justify-content: center;
			align-items: center;
			max-width: 50%;
		}

		/* #becomeamentorbutton {
    margin-bottom: 1rem;
  } */
	}
</style>
