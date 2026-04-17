export default function(Highcharts: any) {
    const H = Highcharts;
    H.wrap(Highcharts.Axis.prototype, "getLinePath", function(this: Highcharts.Axis, proceed: any, lineWidth: number) {
      let linePath: (string | number)[][] = proceed.call(this, lineWidth);

      console.log("getLinePath");
      if (this.horiz) {
        console.log("this.horiz");
          const x: number = parseInt(linePath[1][1] as string);
          const y: number = parseInt(linePath[1][2] as string);

          const arrowSVG = [
              ["M", x, y],
              ["L", x, y + 1],
              ["L", x + 1, y],
              ["L", x, y - 1],
              ["L", x, y]
          ];

          linePath = linePath.concat(arrowSVG);
          console.log("linePath = " + linePath);
          return linePath;
      }
      return linePath;
  });
  }
  