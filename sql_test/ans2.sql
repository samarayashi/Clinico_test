WITH invoice_with_lag AS (
    SELECT 
        i.id,
        i.invoice_number,
        i.invoice_date,
        LAG(i.invoice_number) OVER (
            PARTITION BY SUBSTRING(i.invoice_number FROM 1 FOR 2)
            ORDER BY i.invoice_number
        ) AS prev_invoice_number
    FROM 
        invoices i
)

SELECT 
    iw.id,
    iw.invoice_number,
    LEFT(iw.invoice_number, 2) AS track,
    ib.year,
    ib.month,
    ib.begin_number,
    ib.end_number
FROM 
    invoice_with_lag iw
JOIN 
    invoice_books ib ON LEFT(iw.invoice_number, 2) = ib.track
WHERE (
    -- 檢測斷號的基本條件
    (
        (iw.prev_invoice_number IS NULL 
         AND ib.begin_number < CAST(SUBSTRING(iw.invoice_number FROM 4) AS INTEGER))
        OR
        (CAST(SUBSTRING(iw.invoice_number FROM 4) AS INTEGER) 
         - CAST(SUBSTRING(iw.prev_invoice_number FROM 4) AS INTEGER) > 1)
    )
    -- 特殊情況處理
    AND (
        ib.track != 'AC'  -- 非 AC 字軌正常處理
        OR 
        (ib.track = 'AC' AND CAST(SUBSTRING(iw.invoice_number FROM 4) AS INTEGER) <= 45678988)  -- AC 字軌特殊處理
    )
)
ORDER BY 
    iw.invoice_number;
