// pages/faq.js
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TranslatedText from '../components/i18n/TranslatedText';

export default function FAQ() {
  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>FAQ - Vectorise.Me</title>
        <meta name="description" content="Frequently Asked Questions about Vectorise.Me - Free Online Image to SVG Converter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Frequently Asked Questions</h1>
        
        <div className="prose prose-indigo max-w-none">
          <div className="space-y-10">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-indigo-700 mb-4">What is Vectorise.Me?</h2>
              <p>
                Vectorise.Me is a free online tool that converts raster images (like JPG, PNG, GIF) into scalable vector graphics (SVG). 
                Vector graphics can be scaled to any size without losing quality, making them perfect for logos, icons, illustrations, and other graphics.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-indigo-700 mb-4">How does it work?</h2>
              <p className="mb-3">
                Vectorise.Me uses advanced image processing algorithms to trace the outlines and colors in your raster images and convert them into vector paths. 
                The process involves several steps:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Image preprocessing and optimization</li>
                <li>Color quantization and clustering</li>
                <li>Edge detection and path tracing</li>
                <li>Path simplification and optimization</li>
                <li>SVG generation</li>
              </ol>
              <p className="mt-3">
                The result is a clean, scalable SVG file that preserves the visual appearance of your original image while being fully scalable.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-indigo-700 mb-4">What file formats can I convert?</h2>
              <p className="mb-3">
                Vectorise.Me supports the following input formats:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>PNG</li>
                <li>JPG/JPEG</li>
                <li>GIF</li>
                <li>BMP</li>
                <li>TIFF</li>
                <li>WEBP</li>
              </ul>
              <p className="mt-3">
                The maximum file size for each image is 10MB, and you can upload up to 10 images at once.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-indigo-700 mb-4">Is Vectorise.Me really free?</h2>
              <p>
                Yes, Vectorise.Me is completely free to use. We support our service through advertising revenue, which allows us to provide high-quality vector conversion without charging users.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-indigo-700 mb-4">Do I need to create an account?</h2>
              <p>
                No, Vectorise.Me doesn't require any registration or account creation. You can start converting images immediately without signing up.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-indigo-700 mb-4">What are the different settings and what do they do?</h2>
              <p className="mb-3">
                Vectorise.Me offers several settings to customize your vector output:
              </p>
              
              <div className="ml-4 mt-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Clustering Options</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="font-semibold">B/W vs. Color:</strong> B/W mode creates a black and white vector, while Color mode preserves the colors from your original image.</li>
                  <li><strong className="font-semibold">Cutout vs. Stacked:</strong> Cutout mode creates shapes that cut out from each other, while Stacked mode layers shapes on top of each other.</li>
                </ul>
              </div>
              
              <div className="ml-4 mt-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Filter Options</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="font-semibold">Filter Speckle:</strong> Removes small artifacts and noise from the image. Higher values create cleaner results but may lose small details.</li>
                  <li><strong className="font-semibold">Color Precision:</strong> Controls how accurately colors are preserved. Higher values create more accurate colors but may result in more complex SVGs.</li>
                  <li><strong className="font-semibold">Gradient Step:</strong> Controls how gradients are handled. Higher values create fewer color layers, resulting in simpler SVGs.</li>
                </ul>
              </div>
              
              <div className="ml-4 mt-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Curve Fitting Options</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="font-semibold">Pixel/Polygon/Spline:</strong> Determines how paths are created. Pixel mode preserves pixel edges, Polygon creates straight line segments, and Spline creates smooth curves.</li>
                  <li><strong className="font-semibold">Corner Threshold:</strong> Controls how sharp corners are detected. Higher values create smoother curves with fewer corners.</li>
                  <li><strong className="font-semibold">Segment Length:</strong> Controls the length of path segments. Higher values create more coarse paths with fewer points.</li>
                  <li><strong className="font-semibold">Splice Threshold:</strong> Controls how paths are joined. Higher values create simpler paths but may be less accurate.</li>
                </ul>
              </div>
              
              <div className="ml-4 mt-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Additional Options</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="font-semibold">Stroke Width Detection:</strong> Attempts to detect and preserve stroke widths in the original image.</li>
                  <li><strong className="font-semibold">Background Transparency:</strong> Makes the background transparent in the output SVG.</li>
                </ul>
              </div>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-indigo-700 mb-4">What's the technology behind Vectorise.Me?</h2>
              <p className="mb-3">
                Vectorise.Me is powered by VTracer, an open-source image vectorization library developed by the VisionCortex team. VTracer uses advanced computer vision algorithms to analyze images and convert them into vector paths.
              </p>
              <p className="mb-3">
                The core technology involves:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="font-semibold">Color Quantization:</strong> Reducing the number of colors in the image while preserving visual quality</li>
                <li><strong className="font-semibold">Image Segmentation:</strong> Dividing the image into regions based on color and shape</li>
                <li><strong className="font-semibold">Contour Tracing:</strong> Finding the outlines of shapes in the image</li>
                <li><strong className="font-semibold">Path Optimization:</strong> Simplifying and smoothing paths to create clean vector output</li>
              </ul>
              <p className="mt-3">
                Our web interface makes this powerful technology accessible to everyone without requiring any technical knowledge or software installation.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-indigo-700 mb-4">How can I get the best results?</h2>
              <p className="mb-3">
                For best results with Vectorise.Me:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Start with high-quality, clean images</li>
                <li>Use images with clear, distinct shapes and colors</li>
                <li>Experiment with different settings to find the best combination for your specific image</li>
                <li>For logos and simple graphics, try the B/W mode with higher path simplification</li>
                <li>For colorful illustrations, use Color mode with appropriate color precision</li>
                <li>Use the preview to check results before downloading</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-indigo-700 mb-4">What can I do with the SVG files?</h2>
              <p className="mb-3">
                SVG files created with Vectorise.Me can be used for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Logos and branding materials</li>
                <li>Website graphics and icons</li>
                <li>Print materials (posters, business cards, etc.)</li>
                <li>T-shirt designs and merchandise</li>
                <li>Laser cutting and CNC machining</li>
                <li>Animation and interactive web content</li>
              </ul>
              <p className="mt-3">
                SVGs can be edited with vector graphics software like Adobe Illustrator, Inkscape, or Figma, allowing you to further customize and refine your graphics.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-indigo-700 mb-4">How do I contact support?</h2>
              <p>
                If you have any questions, feedback, or issues with Vectorise.Me, you can contact us through our <a href="/contact" className="text-indigo-600 hover:text-indigo-800">contact form</a> on the website.
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
