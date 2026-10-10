using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using OfficeOpenXml;

namespace ExcelApplication.Controller
{

    [ApiController]
    [Route("[controller]")]
    public class UploadExcelController : ControllerBase
    {
        private readonly ILogger<UploadExcelController> _logger;

        public UploadExcelController(ILogger<UploadExcelController> logger)
        {
            _logger = logger;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            var filePath = Path.Combine(Path.GetTempPath(), file.FileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var data = new List<Dictionary<string, object>>();

            using (var package = new ExcelPackage(new FileInfo(filePath)))
            {
                var worksheet = package.Workbook.Worksheets.FirstOrDefault();
                if (worksheet == null)
                {
                    return BadRequest("No worksheet found in the uploaded Excel file.");
                }

                var rowCount = worksheet.Dimension.Rows;
                var colCount = worksheet.Dimension.Columns;

                for (int row = 2; row <= rowCount; row++) // Assuming first row is header
                {
                    var rowData = new Dictionary<string, object>();
                    for (int col = 1; col <= colCount; col++)
                    {
                        var header = worksheet.Cells[1, col].Text; // Get header from first row
                        var cellValue = worksheet.Cells[row, col].Text;
                        rowData[header] = cellValue;
                    }
                    data.Add(rowData);
                }
            }

            // Clean up the temporary file
            System.IO.File.Delete(filePath);

            return Ok(data);
        }
    }
}