WITH all_invoices AS (
    -- 生成所有應該存在的發票號碼
    SELECT 
        ib.id as book_id,
        CONCAT(ib.track, '-', LPAD(CAST(gs.number AS TEXT), 8, '0')) as invoice_number,
        ib.track,
        ib.year,
        ib.month,
        ib.begin_number,
        ib.end_number
    FROM 
        invoice_books ib
    CROSS JOIN 
        generate_series(
            ib.begin_number, 
            CASE 
                WHEN ib.track = 'AC' THEN LEAST(ib.end_number, 45678988)
                ELSE ib.end_number
            END
        ) as gs(number)
)

-- 查詢未開立的發票
SELECT 
    ai.book_id as id,
    ai.invoice_number,
    ai.track,
    ai.year,
    ai.month,
    ai.begin_number,
    ai.end_number
FROM 
    all_invoices ai
LEFT JOIN 
    invoices i ON ai.invoice_number = i.invoice_number
WHERE 
    i.invoice_number IS NULL
ORDER BY 
    ai.invoice_number;
