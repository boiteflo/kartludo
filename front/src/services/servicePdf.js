import jsPDF from "jspdf";

class ServicePdf {   
    static async generateCardsPdf(images) {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const cardWidth = 63; // mm (taille réelle d'une carte Magic)
      const cardHeight = 88; // mm
      const margin = 5; // mm entre les cartes
      // const pageWidth = 210; // A4 width mm
      // const pageHeight = 297; // A4 height mm

      const cardsPerRow = 3;
      const cardsPerCol = 3;
      const cardsPerPage = cardsPerRow * cardsPerCol;

      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const row = Math.floor((i % cardsPerPage) / cardsPerRow);
        const col = i % cardsPerRow;

        const x = margin + col * (cardWidth + margin);
        const y = margin + row * (cardHeight + margin);

        const img = new Image();
        img.src = image;
        await new Promise((resolve) => {
          img.onload = () => {
            pdf.addImage(img, "JPEG", x, y, cardWidth, cardHeight);
            resolve();
          };
        });

        // Nouvelle page si on atteint 9 cartes
        const isLastCardOfPage = (i + 1) % cardsPerPage === 0;
        const isNotLastImage = i < images.length - 1;
        if (isLastCardOfPage && isNotLastImage) {
          pdf.addPage();
        }
      }

      pdf.save("cartes.pdf");
    }
}


export default ServicePdf;
