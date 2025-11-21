-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost:8889
-- Thời gian đã tạo: Th10 21, 2025 lúc 07:07 PM
-- Phiên bản máy phục vụ: 8.0.40
-- Phiên bản PHP: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `bookstore_db`
--

DELIMITER $$
--
-- Thủ tục
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `search_books` (IN `search_title` VARCHAR(255), IN `search_category` VARCHAR(255), IN `search_author` INT, IN `min_price` DECIMAL(10,2), IN `max_price` DECIMAL(10,2), IN `sort` INT)   BEGIN 
    SELECT 
      b.isbn, 
      b.title, 
      b.price, 
      b.on_sale as onsale, 
      b.image_url as img, 
      b.author_id, 
      GROUP_CONCAT(cb.category SEPARATOR ', ') as categories 
    FROM 
      BOOK b 
      JOIN CATEGORY_BOOK cb ON b.isbn = cb.book_isbn 
    WHERE 
      ( search_title IS NULL OR b.title LIKE CONCAT('%', search_title, '%') ) 
      AND
      ( search_category IS NULL OR cb.category = search_category ) 
      AND 
      ( search_author IS NULL OR b.author_id = search_author ) 
      AND ( min_price IS NULL OR b.price >= min_price ) 
      AND 
      ( max_price IS NULL OR b.price <= max_price ) 
    GROUP BY 
      b.isbn 
    ORDER BY 
      CASE sort WHEN 1 THEN b.price WHEN 2 THEN - b.price ELSE 0 END;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `AUTHOR`
--

CREATE TABLE `AUTHOR` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `img_url` varchar(255) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `AUTHOR`
--

INSERT INTO `AUTHOR` (`id`, `name`, `img_url`, `description`) VALUES
(1, 'Sarfaraz', 'https://demo.tokopress.com/bookie/wp-content/uploads/sites/7/2016/06/author-01.jpg', 'How to Build a Successful Blog Business is a straight forward guide to building a publishing business online that covers everything from choosing a niche to hiring staff, registering a business to selling it.\nFinding traffic to monetizing it whether you are interested in creating an additional income stream or building a fully-fledged business, this is an essential read for web entrepreneurs and online publishers.'),
(2, 'Saifudin A.', 'https://demo.tokopress.com/bookie/wp-content/uploads/sites/7/2016/06/author-02.jpg', 'How to Build a Successful Blog Business is a straight forward guide to building a publishing business online that covers everything from choosing a niche to hiring staff, registering a business to selling it.\nFinding traffic to monetizing it whether you are interested in creating an additional income stream or building a fully-fledged business, this is an essential read for web entrepreneurs and online publishers.'),
(3, 'Brian O Well', 'https://demo.tokopress.com/bookie/wp-content/uploads/sites/7/2016/06/author-03.jpg', 'How to Build a Successful Blog Business is a straight forward guide to building a publishing business online that covers everything from choosing a niche to hiring staff, registering a business to selling it.\nFinding traffic to monetizing it whether you are interested in creating an additional income stream or building a fully-fledged business, this is an essential read for web entrepreneurs and online publishers.'),
(4, 'Atkia', 'https://demo.tokopress.com/bookie/wp-content/uploads/sites/7/2016/06/author-04.jpg', 'How to Build a Successful Blog Business is a straight forward guide to building a publishing business online that covers everything from choosing a niche to hiring staff, registering a business to selling it.');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `BLOG`
--

CREATE TABLE `BLOG` (
  `id` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `banner_url` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `publish_date` date NOT NULL,
  `tag` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `BLOG`
--

INSERT INTO `BLOG` (`id`, `title`, `banner_url`, `content`, `publish_date`, `tag`) VALUES
(1, 'Everything You Need To Know About Blogging', 'https://demo.tokopress.com/bookie/wp-content/uploads/sites/7/2016/06/blog-01.jpg', 'People communicate differently than they used to thanks to technology that didn’t exist before. Blogging is hot right now, and this article can help you to take advantage of that.\n\nMake use of a mind map. Organizing your blog into a mind-map, using the categories, posts, promotion and all of your income sources can be a great method of organization. It creates a way for you to see where your blog is lacking and what you can do to make it more successful.\n\nEverything you do can end up being the subject of a blog. Take notes when you are away from the computer, if you stumble across an idea that may translate into a post. You want to always keep your eyes open for subject ideas. Writing is the easy part, it’s coming up with the initial concept that usually leads to writer’s block.\n\nBlog about interesting things and provide relevant content. Nobody wants to read a saga about doing the dishes and cleaning the bathroom every day. Unless you have a unique way of presenting such common information, your readers really aren’t going to care. Choose topics that are sure to be interesting. Keep in mind that your overall goal is to gain regular readers for your site.\n\nSince blogging is on a personal level you should avoid writing formally. You should still write in a professional manner and use proper grammar. Your readers will be able to relate to you more when you are writing to them in a casual way and will continue reading your blogs.\n\nSimplify your blog by avoiding inordinate amounts of multi-media. While pictures and the occasional video are definitely a nice touch, your words are more important than your ability to place obnoxious GIFs or pictures on your blog posts. Your readers will appreciate having balance in your posts and enjoying both written word and visual elements.\n\nYou should let visitors leave comments on your blog posts. This helps you build up connections with other bloggers, which is a helpful tool. Do not underestimate the power in having good relationships with others. If you need a hand at some point, the blogger that posted on your site may be happy to help.\n\nGive your readers the opportunity to subscribe to your blog and your RSS feed. When people can have good content delivered hot and fresh, you increase your value to them ten fold. Keep the subscribe button in an easy to find place and deliver good content regularly to dissuade readers from discontinuing.\n\nDon’t make your blog look too crowded or your readers will go elsewhere. If you jumble everything together, trying to get the most material you can get on one page, readers will become overwhelmed. Carefully determine what is important to include on a page, and what is better reserved for the next page.\n\nPosting images to your blog is a great way to add interest. Public domain photographs can be found online for free, with a little searching or you can add your own photographs. Visual interest is important because if a blog does not capture the interest of your visitors they will not stick around for very long. So, spice up your blog with images that reflect your content.\n\nPeople the world over can potentially view your blog, so be mindful of this. You voice could influence the actions of many people. Remember that your blog could have a major impact on others, as well as yourself, and strive to make it as good as you can. Hopefully, the tips and tricks that you have just taken a look at can help you propel your blog to the highest possible level of quality.\n\n', '2015-06-28', 'DREAM, IDEA, NOVEL'),
(2, 'Building A Brighter Future With A Successful Blog', 'https://demo.tokopress.com/bookie/wp-content/uploads/sites/7/2016/06/blog-02.jpg', 'Most blogs are focused on one issue. Whether you want to create a blog dedicated to your passion, or you simply want to improve your current blog, the information in this article will help you. Read on to find out how you can join the hordes of already successful online bloggers.\n\nTake any ideas as you get them for blogging. Make sure to create a place where they can be stored. Writing just when inspired can be unproductive to your blog. Many times, the best ideas can appear when you’re not able to blog. So give them a place to grow and flourish.\n\nWhen running a blog, make sure that you ask open-ended questions. One of the most effective methods of getting people to respond to your posts is simply asking for it. Let your readers answer your questions by inviting them to respond with a comment. This makes them feel more engaged, which increases the odds that they’ll stick with you.\n\nIf you want to be a good writer, it is important that you are a good reader. Take the time to actually read what you write about, and enjoy it. When you can read it from a visitor’s point of view, you will be able to get a better understanding of any changes that you need to make to your writing style.\n\nProviding an RSS-to-Email option is a great tip for those running a blog. This can be used so that readers have the ability to subscribe to all your latest posts without needing an RSS reader. Even today, lots of people do not use RSS, so using a RSS-to-Email service is crucial. An excellent choice for one is Feedburner.\n\nThink of your blog posts as travelers. When you have clicked the publish button, the blog post will continue to survive on its own. Your blog post then becomes a traveler. Try giving your posts what they need to deal with any harsh conditions, along with good instructions on how to prosper online.\n\nLearn everything you can about topics related to your blog. The more quality information you can share, the better your blog will be. The greater your knowledge, the more readers will view you as an expert in the field. This will make the reader more likely to share links to your blog with their contacts.\n\nWhen you are attempting to select a topic that will be the basis of your blog, you should make sure that you are interested in your topic. You can’t expect to maintain a blog whose topic doesn’t interest you in anyway. Selecting a topic that you love increases the chance that you’ll stick with continually updating your blog, which will generate new readers.\n\nUse a lot of plug-ins on your blog because it gives users the motivation to stick around and explore more of your site. The longer you have someone on your site the more likely they will be to make a purchase. “Most popular posts” and “relevant posts” are just a couple of the most popular plug-ins.\n\nMany people overlook the importance of having a keyword rich URL. Having a URL that has keywords related to your article will instantly boost the chances that your site will be seen by someone that is searching the internet on the various search engines. This is a simple step that you can take that will increase your viewership for your blog.\n\nHopefully, you’ve been able to digest what you’ve read here and benefit from it! It’s completely normal if you’re feeling somewhat overwhelmed right now. The work involved in making your own blog and maintaining it can be hard, but rewarding work. If you use the tips in this article and save it, you will have it as a resource whenever you need some help\n', '2015-06-28', 'DREAM, IDEA, NOVEL'),
(3, 'Blogging And How You Can Get A Lot From It', 'https://demo.tokopress.com/bookie/wp-content/uploads/sites/7/2016/06/blog-03.jpg', 'Whether you’re just looking to type about a hobby you have or if you want to attempt to run a business, starting a blog might be worthy of your consideration. Before you get started, first take a few minutes to read these expert-provided tips below. Once you learn about blogging, the process becomes a lot simpler.\n\nCreate a blogroll. A blogroll is a list of other blogs in your niche that you find valuable. Creating such a list increases your blog’s value to readers, as they may be able to find content that they couldn’t find on your blog. If you use your blog for marketing, a blogroll will also increase your credibility in the marketplace.\n\nKeep your readers’ attention by reducing the text blocks. If your readers see a large, ongoing length of text, they are apt to move on. This intimidates the viewers sense of comfort and ease of reading. They will anticipate a more interesting read if they see small chunks of text, that are easy on the eyes.\n\nTry posting in advance. Do not be shy, or think that it can ruin the authenticity of your blog. As long as you remain the author that writes timeless content, there won’t be any problems. Posting in advance can be a good strategy to use, and it can relieve your stress by already covering something ahead of time.\n\nThink of your blog posts as travelers. When you have clicked the publish button, the blog post will continue to survive on its own. Your blog post then becomes a traveler. Try giving your posts what they need to deal with any harsh conditions, along with good instructions on how to prosper online.\n\nTo help you get more traffic to your blog and keep up with the latest trends, you should focus some of your attention on submitting your post and blog links to social bookmarking sites. Sites such as Digg, StumbleUpon, Reddit, are all great places where you can submit your blog links.\n\nGetting involved with affiliate marketing is a great way to generate income from your blog. It can be very effective since you get to decide which products to promote. You should always try to promote products that are related to your blog posts. Doing this will not only help you make money, but will also provide your readers with links to products they might be interested in purchasing.\n\nAvoid being a blogger who offers no unique content on your blog. You cannot expect to have success by running a blog that is very similar to other blogs. Offering unique content that is not found anywhere else within your niche is the right path towards finding success with your blog.\n\nTake time to read over your blog. This step tends to be ignored quite often. You have to be the first reader. Whenever you have some free time, try reading some of your older posts. It can really help you see what you can do to improve with your posts in the future.\n\nAvoid thinking of blogging as a simple thing. You should constantly develop new strategies, learn new techniques and treat your blog as a revenue source. Learn from other seasoned bloggers, and incorporate different strategies and techniques that you pick up along the way. Continuously improve and learn about new blogging methods that will help you move forward.\n\nHaving accurate information to refer to through the blogging process is a big positive. For every successful blog out there, you can bet that there are hundreds that it not. Use what you’ve learned in the article and avoid becoming one of the many; you should aim to be one of the few.', '2015-06-28', 'DREAM, IDEA, NOVEL'),
(4, 'Expert Advice On Building A Better Blogging Plan', 'https://demo.tokopress.com/bookie/wp-content/uploads/sites/7/2016/06/blog-04.jpg', 'While getting the hang of new technology may overwhelm you at first, blogging is simple enough that nearly anyone can participate. Of course, there is a certain level of skill and creativity involved with developing a captivating blog, but you can learn what you do not know and cultivate your skills to really get your message across to website visitors.\n\nIf you are interested in blogging, but you don’t particularly like to write, try starting a blog about one of your creative talents. You could try a photography blog and share your hobby with others. Or you may write poetry or music that you could post samples of. If people like what you have to offer, they will come back for more.\n\nTo garner more interest in your blog, a great idea is to comment on other blogs. If you like Google reader, create a separate folder in it for other blogs you’re following. Visit these sites regularly and, when you do, leave comments.\n\nHarness the power of web 3.0. The web isn’t just text anymore, so neither should your blog. Use many different types of content to enhance your blog posts. For instance, if you are posting about a trade show in your niche, add a Youtube video of the event so that people can experience it more directly. If you are posting about a new product, include a Flash product demonstration.\n\nMake controversial posts. We all know this is what keeps readers coming back for more. Think about it, if you write a post that everyone agrees with, it will get boring and many people won’t want to read it. When you write controversial things it will keep readers coming back for more.\n\nWrite about what you know. When blogging, in particular, it is important to write about what you actually know and understand. You could, of course, put a spin on a blog by talking about how you really don’t understand something. For the most part, however, your readers are going to be interested in your expertise and knowledge.\n\nMaintain the health of your blog. Doing so means maintaining your blog properly and varying things from time to time. This will ensure that your blog functions properly and prevent your visitors from becoming bored with your site.\n\nMake a publishing filter. Be controlled and consistent with your blog posts. Try to make a publishing filter for use each time you write. It could be as simple as writing down some questions that your post can answer by the time it’s finished. It can help keep you focused.\n\nIf you are wanting to run a potentially profitable blog, you should ensure that your niche is one that is very marketable to others. Although it’s important to select a topic that interests you, you can’t simply go by that because some topics aren’t very marketable. This is fine if you don’t care about making money with your blog. Otherwise, marketability is extremely important.\n\nUse empty space to improve visual interest in your page. There is a reason why those who produce hard copy material abide by certain formatting rules. Margins, spacing between lines and blocks of text, and even spacing between sentences is important to the overall visual effect of your blog.\n\nAs you see now, blogging can enhance the online experience for visitors to your website and will in turn, create the desired results of increased sales. If clients and business associates enjoy the time they spend becoming informed about your products and services, they will be more likely to purchase them. Apply the concepts you’ve learned here and start blogging today.', '2015-06-28', 'DREAM, IDEA, NOVEL'),
(5, 'Excellent Blogging Tips: A Smart Place To Start!', 'https://demo.tokopress.com/bookie/wp-content/uploads/sites/7/2016/06/blog-05.jpg', 'A lot of individuals today desire to have lots of people know of their presence online. Having an audience is a good way to be successful in different marketing areas. Blogging is a great way to build an audience and establish your voice. Check out this article for tips and advice about blogging that will help you get started.\n\nMake sure that you do not have duplicate content. You can check for this by using the robots that are out there. If you do have content that is duplicated, the search engines will probably tag your site for spam, and you will not wind up getting the attention that you are looking for.\n\nMake sure that you are accepting and submitting valuable comments. You want to have as many ways as possible for a back link to happen. When you do comment, add your URL so that you will have a link created to your blog. This will make it easy for others to find you.\n\nMake sure that you are productive with your blog. Do not allow yourself to waste your time watching television, or playing games when you could be doing things to make your blog bring in more visitors. When you are using a blog to make money, you are going to have to put the work hours into it.\n\nAvoid writing blogs about subjects you have no interest in or know nothing about. It will reflect in your writing and you could possibly come across as uninformed in you are unsure of what you are writing about. This can turn readers off and they will avoid revisiting your site.\n\nTry doing some writing challenges. Push yourself by completing writing exercises. Try choosing a number of words per every post. Try writing personal stories. Create a how-to. Try writing a 100 item list. Write a specified number of posts within a certain time frame. Try expanding your skills beyond what you already possess.\n\nGuest blogging can be your best friend when it comes to leading readers to your own blog. Find a good, relevant blog whose owner will allow you to post. Then create some awesomely written posts and make them stand out among other guest posts. Use this tool to give readers a taste of what they can find by hopping over to your blog!\n\nWhen formatting a blog it is important that you keep the design clean and readable. You want your viewers to enjoy the experience of reading your blog. One way to make a great blog design is to pick a light background, preferably white, and choose text that is a very dark shade. This contrast will make it easy for your visitors to easily read your every word.\n\nConsider making posts that contain fun lists, like a “top ten,” or whatever number you desire. You can do this on a regular basis, enticing your readers to see what interesting list you conceive next. You can use bullets or numbers, with links to greater content included in each one.\n\nUse bulleting to ensure that certain points stand out in your blog. Bulleting is used in traditional print media as well. That is because it makes even difficult to digest material more manageable for readers. Bulleting should be reserved, of course, for delineating the most important parts of your text.\n\nMake sure that you post content to your blog on a regular basis or you can lose readers. When readers subscribe to your blog, they do so because they have a genuine interest in what you have to say. Leaving them hungry for information will, most likely, lead them to go seek new content elsewhere.\n\nHopefully, this article has given you a deeper understanding of a blog’s importance, and the skills that you can use to build a great one. Use what you’ve learned here to reach great blogging success in short order!', '2015-06-28', 'DREAM, IDEA, NOVEL');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `BOOK`
--

CREATE TABLE `BOOK` (
  `isbn` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `on_sale` int DEFAULT '0',
  `image_url` varchar(255) DEFAULT NULL,
  `author_id` int NOT NULL,
  `cover_designer` varchar(255) DEFAULT NULL,
  `pages` int NOT NULL,
  `publisher` varchar(255) DEFAULT NULL,
  `lang` varchar(255) NOT NULL,
  `released` date NOT NULL,
  `description` text NOT NULL
) ;

--
-- Đang đổ dữ liệu cho bảng `BOOK`
--

INSERT INTO `BOOK` (`isbn`, `title`, `price`, `on_sale`, `image_url`, `author_id`, `cover_designer`, `pages`, `publisher`, `lang`, `released`, `description`) VALUES
(1, 'Lyrics of the Lalala Musical', 24.99, 10, 'https://demo.tokopress.com/bookie/wp-content/uploads/sites/7/2016/06/book-01.jpg', 1, 'Amanda Smith', 256, 'Penguin Books', 'English', '2022-01-01', 'This is the official songbook for the hit musical \"Lalala\". It includes all of the lyrics from the show, as well as exclusive behind-the-scenes photos and commentary from the writers and performers. Perfect for fans of the show or anyone who loves musical theater!'),
(2, 'See Me', 14.99, 0, 'https://demo.tokopress.com/bookie/wp-content/uploads/sites/7/2016/06/book-02.jpg', 2, 'Sarah Johnson', 320, 'Grand Central Publishing', 'English', '2015-10-13', 'A romantic suspense novel by bestselling author Nicholas Sparks, featuring characters with complicated pasts and a dangerous present. Will they be able to overcome their differences and find love?'),
(3, 'The Dead Compendium Volume 3', 29.99, 20, 'https://demo.tokopress.com/bookie/wp-content/uploads/sites/7/2016/06/book-03.jpg', 3, 'Mark Johnson', 1120, 'Image Comics', 'English', '2015-09-29', 'The third volume of the popular graphic novel series \"The Walking Dead\", collecting issues #97-144. Follow the survivors as they struggle to survive in a world overrun by zombies. This volume includes the introduction of fan-favorite character Negan.'),
(4, 'Big Magic Beyond Fear', 12.99, 5, 'https://demo.tokopress.com/bookie/wp-content/uploads/sites/7/2016/06/book-04.jpg', 4, 'Emily Wilson', 288, 'Riverhead Books', 'English', '2016-09-27', 'A self-help book by Elizabeth Gilbert, author of \"Eat, Pray, Love\". In this book, Gilbert shares her insights on creativity, inspiration, and fear, and encourages readers to embrace their creativity and pursue their passions.'),
(5, 'Kill Shot Assassin Thriller', 9.99, 0, 'https://demo.tokopress.com/bookie/wp-content/uploads/sites/7/2016/06/book-05.jpg', 1, 'David Smith', 416, 'Pocket Books', 'English', '2012-02-07', 'A thriller novel by Vince Flynn, featuring CIA operative Mitch Rapp. In this installment, Rapp is tasked with tracking down a group of terrorists who are planning a major attack on the United States. Will he be able to stop them in time?'),
(6, 'The American Lady', 8.99, 0, 'https://demo.tokopress.com/bookie/wp-content/uploads/sites/7/2016/06/book-06.jpg', 2, 'Samantha Green', 464, 'Berkley Books', 'English', '2012-02-07', 'A historical romance novel by Petra Durst-Benning, set in the early 20th century. The story follows a young woman named Sophie who leaves Germany for America in search of a better life. Along the way, she meets a handsome man named Luke and the two fall in love. But will their love be enough to overcome the challenges they face?'),
(7, 'Everything’s Eventual: Tales', 12.99, 0, 'https://demo.tokopress.com/bookie/wp-content/uploads/sites/7/2016/06/book-07.jpg', 3, 'Sarah Williams', 464, 'Scribner', 'English', '2002-03-19', 'A collection of 14 short stories by Stephen King, ranging from horror to science fiction to suspense. These stories showcase King\'s mastery of storytelling and his ability to create unforgettable characters.'),
(8, 'Act of Treason (A Rapp Novel)', 8.99, 0, 'https://demo.tokopress.com/bookie/wp-content/uploads/sites/7/2016/06/book-08.jpg', 4, 'Mark Johnson', 480, 'Pocket Star', 'English', '2006-09-12', 'A political thriller novel by Vince Flynn, featuring the CIA operative Mitch Rapp. In this book, Rapp must uncover a conspiracy that involves some of the highest levels of the US government. Will he be able to stop the conspirators before it\'s too late?'),
(9, 'American Assassin Thriller', 14.99, 5, 'https://demo.tokopress.com/bookie/wp-content/uploads/sites/7/2016/06/book-09.jpg', 1, 'Tom Lee', 464, 'Atria/Emily Bestler Books', 'English', '2010-07-06', 'A thriller novel by Vince Flynn, which serves as a prequel to his Mitch Rapp series. In this book, a young Mitch Rapp is recruited by the CIA to become a top secret agent. But as he goes through his training, he realizes that not everything is as it seems.'),
(10, 'Humans of New York: Stories', 22.99, 0, 'https://demo.tokopress.com/bookie/wp-content/uploads/sites/7/2016/06/book-10.jpg', 2, 'Brandon Stanton', 432, 'St. Martin\'s Press', 'English', '2015-10-13', 'A collection of photographs and stories from the popular Humans of New York blog. In this book, photographer Brandon Stanton captures the diversity and humanity of New York City through the stories of the people who live there.'),
(11, 'Everything’s Eventual: Dark', 9.99, 0, 'https://demo.tokopress.com/bookie/wp-content/uploads/sites/7/2016/06/book-11.jpg', 3, 'Sarah Williams', 480, 'Pocket Books', 'English', '2002-11-01', 'A collection of 14 more short stories by Stephen King, all of which have a dark and unsettling tone. From a man who receives messages from the future to a woman who must confront her deepest fears.'),
(12, 'Trail of Broken Wings', 14.99, 0, 'https://demo.tokopress.com/bookie/wp-content/uploads/sites/7/2016/06/book-12.jpg', 4, 'John Smith', 352, 'Penguin Random House', 'English', '2015-05-19', 'A powerful and emotional novel about the secrets and betrayals that can break a family apart.'),
(13, 'The Glassblower', 12.99, 1, 'https://demo.tokopress.com/bookie/wp-content/uploads/sites/7/2016/06/book-13.jpg', 1, 'Jane Doe', 448, 'HarperCollins', 'English', '2016-03-01', 'A captivating historical fiction novel about a family of glassblowers in 19th century Germany.'),
(14, 'Frozen Stories', 7.99, 0, 'https://demo.tokopress.com/bookie/wp-content/uploads/sites/7/2016/06/book-14.jpg', 2, 'Sarah Lee', 64, 'Disney Press', 'English', '2014-09-02', 'A collection of short stories based on the hit Disney movie Frozen.'),
(15, '5-Minute Stories', 9.99, 0, 'https://demo.tokopress.com/bookie/wp-content/uploads/sites/7/2016/06/book-16.jpg', 3, 'Tom Smith', 192, 'Disney Press', 'English', '2019-01-08', 'A collection of short stories featuring beloved Disney characters, perfect for bedtime reading.'),
(16, 'The Forgotten Garden', 11.99, 1, 'https://demo.tokopress.com/bookie/wp-content/uploads/sites/7/2016/06/book-17.jpg', 4, 'Anne Doe', 560, 'Washington Square Press', 'English', '2009-02-03', 'A mysterious and enchanting novel about a woman who discovers a long-hidden family secret while searching for her roots.');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `CART`
--

CREATE TABLE `CART` (
  `user_id` int NOT NULL,
  `book_isbn` int NOT NULL,
  `quantity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `CATEGORY_BOOK`
--

CREATE TABLE `CATEGORY_BOOK` (
  `category` varchar(255) NOT NULL,
  `book_isbn` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `CATEGORY_BOOK`
--

INSERT INTO `CATEGORY_BOOK` (`category`, `book_isbn`) VALUES
('Drama', 1),
('Inspiration', 1),
('Life Style', 2),
('Love Story', 2),
('Business', 3),
('Culture', 4),
('Science', 5),
('Life Style', 6),
('Culture', 7),
('Drama', 8),
('Love Story', 9),
('Business', 10),
('Inspiration', 11),
('Science', 12),
('Drama', 13),
('Culture', 14),
('Life Style', 15),
('Business', 16);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `CONTACT`
--

CREATE TABLE `CONTACT` (
  `id` int NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `resolved` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `CONTACT`
--

INSERT INTO `CONTACT` (`id`, `fullname`, `email`, `title`, `message`, `resolved`) VALUES
(7, 'malisa', 'malisa@gmail.com', 'Good', 'I realy love book', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ORDERS`
--

CREATE TABLE `ORDERS` (
  `id` int NOT NULL,
  `user_id` int NOT NULL DEFAULT '-1',
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `telephone` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` enum('Pending','Done','Cancell') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `ORDERS`
--

INSERT INTO `ORDERS` (`id`, `user_id`, `name`, `email`, `address`, `telephone`, `price`, `created_at`, `status`) VALUES
(1, 7, 'tuấn kiệt', 'tuankiet0112005@gmail.com', '11A Trần Bình Trọng', '0382786542', 37.48, '2025-11-22 02:01:08', 'Pending');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ORDER_ITEM`
--

CREATE TABLE `ORDER_ITEM` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `book_isbn` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `ORDER_ITEM`
--

INSERT INTO `ORDER_ITEM` (`id`, `order_id`, `book_isbn`, `quantity`, `price`) VALUES
(1, 1, 1, 1, 22.49),
(2, 1, 2, 1, 14.99);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `REVIEW`
--

CREATE TABLE `REVIEW` (
  `id` int NOT NULL,
  `rating` int NOT NULL,
  `review` text,
  `user_id` int NOT NULL,
  `book_isbn` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `REVIEW`
--

INSERT INTO `REVIEW` (`id`, `rating`, `review`, `user_id`, `book_isbn`) VALUES
(1, 4, 'I really enjoyed this book and would definitely recommend it to others!', 2, 1),
(2, 3, 'This book was pretty good, but I didn\'t love it.', 3, 5),
(3, 5, 'Absolutely loved this book! Would read it again and again!', 4, 10),
(4, 2, 'I wasn\'t a fan of this book. It was too slow-paced for my liking.', 5, 14),
(5, 4, 'I found this book to be informative and engaging. Would recommend to anyone interested in the topic.', 6, 16),
(6, 3, 'I thought this book was just okay. It didn\'t really hold my interest.', 2, 3),
(7, 5, 'I absolutely loved this book! It was well-written and kept me engaged from beginning to end.', 3, 6),
(8, 4, 'This was a great book! I learned a lot and would recommend it to others.', 4, 8),
(9, 2, 'I didn\'t really enjoy this book. It was too predictable for my liking.', 5, 12),
(10, 5, 'This book was fantastic! I couldn\'t put it down and would definitely read it again.', 6, 15);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `USER`
--

CREATE TABLE `USER` (
  `id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `token` varchar(255) DEFAULT '',
  `token_expiry` datetime DEFAULT NULL,
  `fullname` varchar(255) NOT NULL,
  `bday` date DEFAULT NULL,
  `avt_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `USER`
--

INSERT INTO `USER` (`id`, `email`, `username`, `password`, `role`, `token`, `token_expiry`, `fullname`, `bday`, `avt_url`) VALUES
(1, 'admin@example.com', 'admin', '$2y$10$DVqz9I7oFKR/c0h5juTL3uxQWujtmtE3dY7cunDvH9KfiDrGfgu0K', 'admin', '', NULL, 'Original Admin', NULL, NULL),
(2, 'john@example.com', 'johnsmith', '$2y$10$DVqz9I7oFKR/c0h5juTL3uxQWujtmtE3dY7cunDvH9KfiDrGfgu0K', 'user', '', NULL, 'John Smith', '1990-01-01', NULL),
(3, 'lisa@example.com', 'lisawhite', '$2y$10$DVqz9I7oFKR/c0h5juTL3uxQWujtmtE3dY7cunDvH9KfiDrGfgu0K', 'user', '', NULL, 'Lisa White', NULL, NULL),
(4, 'sam@example.com', 'samjones', '$2y$10$DVqz9I7oFKR/c0h5juTL3uxQWujtmtE3dY7cunDvH9KfiDrGfgu0K', 'user', '', NULL, 'Sam Jones', '1995-08-15', NULL),
(5, 'jane@example.com', 'jane_doe', '$2y$10$DVqz9I7oFKR/c0h5juTL3uxQWujtmtE3dY7cunDvH9KfiDrGfgu0K', 'admin', '', NULL, 'Jane Doe', '1985-05-23', NULL),
(6, 'jim@example.com', 'jimbrown', '$2y$10$DVqz9I7oFKR/c0h5juTL3uxQWujtmtE3dY7cunDvH9KfiDrGfgu0K', 'user', '', NULL, 'Jim Brown', '1982-12-31', NULL),
(7, 'tuankiet0112005@gmail.com', 'tikeyjr11', '$2y$10$is0jh10XuDY8rWNWchU9h.JsEYBWKD5bYuabS.zViWkeHLELhC2/2', 'user', '', NULL, 'trinh hoang', NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `USER_LIKE_BOOK`
--

CREATE TABLE `USER_LIKE_BOOK` (
  `user_id` int NOT NULL,
  `book_isbn` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `AUTHOR`
--
ALTER TABLE `AUTHOR`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `BLOG`
--
ALTER TABLE `BLOG`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `BOOK`
--
ALTER TABLE `BOOK`
  ADD PRIMARY KEY (`isbn`),
  ADD KEY `author_id` (`author_id`);

--
-- Chỉ mục cho bảng `CART`
--
ALTER TABLE `CART`
  ADD PRIMARY KEY (`user_id`,`book_isbn`),
  ADD KEY `book_isbn` (`book_isbn`);

--
-- Chỉ mục cho bảng `CATEGORY_BOOK`
--
ALTER TABLE `CATEGORY_BOOK`
  ADD PRIMARY KEY (`book_isbn`,`category`);

--
-- Chỉ mục cho bảng `CONTACT`
--
ALTER TABLE `CONTACT`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `ORDERS`
--
ALTER TABLE `ORDERS`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `ORDER_ITEM`
--
ALTER TABLE `ORDER_ITEM`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `book_isbn` (`book_isbn`);

--
-- Chỉ mục cho bảng `REVIEW`
--
ALTER TABLE `REVIEW`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `book_isbn` (`book_isbn`);

--
-- Chỉ mục cho bảng `USER`
--
ALTER TABLE `USER`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Chỉ mục cho bảng `USER_LIKE_BOOK`
--
ALTER TABLE `USER_LIKE_BOOK`
  ADD PRIMARY KEY (`user_id`,`book_isbn`),
  ADD KEY `book_isbn` (`book_isbn`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `AUTHOR`
--
ALTER TABLE `AUTHOR`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `BLOG`
--
ALTER TABLE `BLOG`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `BOOK`
--
ALTER TABLE `BOOK`
  MODIFY `isbn` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `CONTACT`
--
ALTER TABLE `CONTACT`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `ORDERS`
--
ALTER TABLE `ORDERS`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `ORDER_ITEM`
--
ALTER TABLE `ORDER_ITEM`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `REVIEW`
--
ALTER TABLE `REVIEW`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `USER`
--
ALTER TABLE `USER`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `BOOK`
--
ALTER TABLE `BOOK`
  ADD CONSTRAINT `book_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `AUTHOR` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `CART`
--
ALTER TABLE `CART`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `USER` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`book_isbn`) REFERENCES `BOOK` (`isbn`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `CATEGORY_BOOK`
--
ALTER TABLE `CATEGORY_BOOK`
  ADD CONSTRAINT `category_book_ibfk_1` FOREIGN KEY (`book_isbn`) REFERENCES `BOOK` (`isbn`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `ORDER_ITEM`
--
ALTER TABLE `ORDER_ITEM`
  ADD CONSTRAINT `order_item_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `ORDERS` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_item_ibfk_2` FOREIGN KEY (`book_isbn`) REFERENCES `BOOK` (`isbn`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `REVIEW`
--
ALTER TABLE `REVIEW`
  ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `USER` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `review_ibfk_2` FOREIGN KEY (`book_isbn`) REFERENCES `BOOK` (`isbn`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `USER_LIKE_BOOK`
--
ALTER TABLE `USER_LIKE_BOOK`
  ADD CONSTRAINT `user_like_book_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `USER` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_like_book_ibfk_2` FOREIGN KEY (`book_isbn`) REFERENCES `BOOK` (`isbn`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
