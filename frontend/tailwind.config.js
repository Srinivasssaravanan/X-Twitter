import daisyui from "daisyui";
import daisyUIThemes from "daisyui/src/theming/themes";
/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {},
	},
	plugins: [daisyui],

	daisyui: {
		themes: [
			"light",
			{
				black: {
					...daisyUIThemes["black"],
					primary: "rgb(29, 155, 240)",
					secondary: "rgb(24, 24, 24)",
				},
			},
		],
	},
};
/*
to operate the tailwind styles only to specific file name we are using that line 5
Because Tailwind uses something called "Purge" (now just called "content scanning") to remove unused styles and keep your CSS file small and fast.
if you are doing large proj you must prefer tailwind becoz only necessary used class names are included in tailwind not like normal css. for eg : 

<!-- Only using button -->
<button class="button">Click Me</button>

here you are only using btton class but in css you may include .card and .alert which are not in use but still css consumes space so it slows down the 
speed.in tailwind you may have may class names like 
<button className="bg-blue-500 text-white">Click Me</button>
All the other thousands of Tailwind utility classes like bg-red-500, rounded, shadow, border, etc.
 are not included in the final CSS. 
 automatic removal of class names 
*/ 
/* 

reason for jsx is its the combination of html and js so it is easily readable and syntax is easy to understand.In normal js you will use
const element = React.createElement(
  "div",
  { className: "greeting" },
  React.createElement("h1", null, "Hello World")
);
but in jsx:
 <div className="greeting">
  <h1>Hello World</h1>
</div>
No need to use React.createElement() all the time
*/