# "[Prepaga] [ciudad]": títulos con sucursal, horario y teléfono (27-nov-2026)

Search Console al 22-nov: las páginas marca × provincia y marca × localidad suman unas 160.000 impresiones con CTR 0,62%.
- 60.000 de esas impresiones son la marca y la ciudad solas ("osde rosario").
- Cuando se agrega algo, casi siempre es "teléfono": se busca la sucursal.

Qué cambió, solo en Swiss Medical, OSDE, Sancor Salud, Avalian y Premedic:
- **Título**: "OSDE Rosario: sucursal en Bv. Oroño 949, horario y teléfono", o "N sucursales" cuando hay varias.
- **Sin sucursal cargada** (Sancor): "Sancor Salud Córdoba: teléfono y planes desde $X/mes".
- **Descripción**: dirección, horario, teléfono de atención oficial y planes desde.
- **Página**: bloque "Teléfonos de [prepaga]", con los canales oficiales (`lib/data/contactos.ts`) y sin la línea de ventas.

Las demás prepagas (Prevención, Galeno, Medicus, Italiano, CEMIC…) no cambian: son el control. Medir el 11-dic y el 25-dic: el CTR de cada grupo contra esta base.

| Grupo | Páginas con clics | Clics | Impresiones | CTR |
|---|---|---|---|---|
| Prueba (Swiss, OSDE, Sancor, Avalian, Premedic) | 93 | 530 | 84.481 | 0,63% |
| Control (el resto de las prepagas) | 81 | 478 | 77.267 | 0,62% |
