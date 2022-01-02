use num_bigint::ToBigUint;
use std::fmt::Debug;
use std::io::stdin;
use std::mem::replace;
use std::str::FromStr;

fn main() {
    println!("What do you want to do? [Type 1, 2, or 3]");
    println!("1. Convert temperature");
    println!("2. Get the nth fibonacci number");
    println!("3. Print the lyrics to \"The Twelve Days of Christmas\"");

    const VALID_ACTIONS: [&str; 3] = ["1", "2", "3"]; // I tried using range then [u32; 3] but ugh
    let action = get_input_of_option(&VALID_ACTIONS, "That was not 1, 2, or 3");

    match action {
        "1" => convert_temp(),
        "2" => nth_fibonacci(),
        "3" => print_twelve_days(),
        _ => panic!("This should never happen"),
    }
}

// Feels like there's a better way
// Maybe somehow combine these functions?

// Also apparently the compiler doesn't know if the output comes from
// `slice` or `miss_message`, so there's some typescript-generic-like fix.
// I'm not supposed to know about that yet but the compiler suggestion works
fn get_input_of_option<'a>(slice: &'a [&str], miss_message: &str) -> &'a str {
    loop {
        let mut input = String::new();
        stdin().read_line(&mut input).expect("Input error!");

        let input = input.trim();
        for option in slice {
            if input == *option {
                return *option;
            }
        }
        println!("Got {}", input);
        println!("{}", miss_message);
    }
}

fn get_input<T: FromStr + std::cmp::PartialEq>(input_type: &str) -> T
where
    <T as FromStr>::Err: Debug,
{
    loop {
        let mut input = String::new();
        stdin().read_line(&mut input).expect("Input error!");

        let parse = input.trim().parse::<T>();
        match parse {
            Ok(parse) => break parse,
            Err(error) => println!("Invalid input {:?}! Needs {}", error, input_type),
        }
    }
}

fn convert_temp() {
    const UNITS: [&str; 2] = ["C", "F"];

    println!("Which unit? [Type C or F]");
    let unit = get_input_of_option(&UNITS, "C or F");

    println!("What temperature?");
    let temp: f64 = get_input("number (real)");

    let result = if unit == "C" {
        celsius_to_fahrenheit(temp)
    } else {
        fahrenheit_to_celsius(temp)
    };
    println!("Result: {}", result);
}

// https://en.wikipedia.org/wiki/Conversion_of_scales_of_temperature
// These extraneous functions are so innocuous...
fn celsius_to_fahrenheit(celsius: f64) -> f64 {
    celsius * 9.0 / 5.0 + 32.0
}

// Did you know that water doesn't boil at 100 degress Celsius anymore?
fn fahrenheit_to_celsius(fahrenheit: f64) -> f64 {
    (fahrenheit - 32.0) * 5.0 / 9.0
}

// I tried to manually code BigInt, but gave up and used a crate
// And when I looked at the documentation, bam, fibonacci.
// Guess that's one way to solve the problem.
type N64 = u64;

fn nth_fibonacci() {
    println!("\"n\" = ?");
    let n: N64 = get_input("positive int");

    let mut f0 = 0.to_biguint().unwrap();
    let mut f1 = 1.to_biguint().unwrap();

    for _ in 0..n {
        // Compiler pointer stuff smhhhhh
        let f2 = f0 + &f1;
        // Low cost f0 <- f1; f1 <- f2
        f0 = replace(&mut f1, f2);
    }

    println!("The {}{} fibonacci number is: {}", n, ordinal_suffix(n), f0)
}

fn ordinal_suffix(n: N64) -> &'static str {
    let n = n % 100; // Optimization

    // The compiler knows what it doesn't know.
    if 10 <= n && n < 20 {
        "th"
    } else {
        match n % 10 {
            0 => "th",
            1 => "st",
            2 => "nd",
            3 => "rd",
            _ => "th",
        }
    }
}

fn print_twelve_days() {
    const ORDINALS: [&str; 12] = [
        "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth",
        "tenth", "eleventh", "twelfth",
    ];
    const CARDINALS: [&str; 12] = [
        "a", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven",
        "twelve",
    ];

    // There are many variations of the song so better write them down as variables
    // Currently using the wikipedia lyrics
    const VARIATION_GIVER: &str = "true love";
    const VARIATION_GIVER_ACTION: &str = "sent";
    const VARIATION_GIFTS: [&str; 12] = [
        "partridge in a pear tree",
        "turtle doves",
        "French hens",
        "calling birds",
        "gold rings",
        "geese a-laying",
        "swans a-swimming",
        "maids a-milking",
        "ladies dancing",
        "lords a-leaping",
        "pipers piping",
        "drummers drumming",
    ];

    for verse in 0..12 {
        println!(
            "On the {} day of Christmas my {} {} to me",
            ORDINALS[verse], VARIATION_GIVER, VARIATION_GIVER_ACTION
        );

        for i in (0..=verse).rev() {
            let cardinal = CARDINALS[i];
            let gift = VARIATION_GIFTS[i];

            if i == 0 {
                if verse == 0 {
                    println!("{} {}.", to_first_capitalized(cardinal), gift);
                } else {
                    println!("And {} {}.", cardinal, gift);
                }
            } else {
                println!("{} {},", to_first_capitalized(cardinal), gift);
            }
        }

        println!();
    }
}

/// Capitalizes the first letter in a string
fn to_first_capitalized(s: &str) -> String {
    if s.len() == 0 {
        return s.to_string();
    }

    // Using to_ascii_uppercase here, but if the file needed to capitalize
    // unicode mess, this would use UnicodeSegmentation::graphemes instead
    let first_char = s.get(0..1);
    let first_char = first_char
        .map(|first_char| first_char.to_ascii_uppercase())
        .unwrap();

    format!("{}{}", first_char, s.get(1..).unwrap())
}
