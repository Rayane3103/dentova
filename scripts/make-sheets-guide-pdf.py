# -*- coding: utf-8 -*-
"""Generates the branded client-facing Google Sheets setup guide (French)."""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table, TableStyle,
    KeepTogether,
)

# --- Dentova brand palette -------------------------------------------------
NAVY = colors.HexColor("#14123a")
VIOLET = colors.HexColor("#321246")
TEAL = colors.HexColor("#73cbd5")
MAGENTA = colors.HexColor("#9817a0")
ICE = colors.HexColor("#f4f3fa")
MUTED = colors.HexColor("#574691")
MINT = colors.HexColor("#eefafb")
AMBER_BG = colors.HexColor("#fdf3e7")
AMBER_LINE = colors.HexColor("#e08a1e")

OUTPUT = "dentova-configuration-google-sheets.pdf"

PAGE_W, PAGE_H = A4
MARGIN_X = 18 * mm
HEADER_H = 34 * mm
FOOTER_H = 14 * mm

# --- Styles ----------------------------------------------------------------
styles = {
    "intro": ParagraphStyle(
        "intro", fontName="Helvetica", fontSize=10.5, leading=15,
        textColor=NAVY, spaceAfter=4,
    ),
    "step_title": ParagraphStyle(
        "step_title", fontName="Helvetica-Bold", fontSize=12, leading=15,
        textColor=NAVY, spaceAfter=3,
    ),
    "bullet": ParagraphStyle(
        "bullet", fontName="Helvetica", fontSize=9.6, leading=13,
        textColor=colors.HexColor("#2b2a45"), leftIndent=2, spaceAfter=1,
    ),
    "badge": ParagraphStyle(
        "badge", fontName="Helvetica-Bold", fontSize=15, leading=17,
        textColor=colors.white, alignment=1,
    ),
    "callout_title": ParagraphStyle(
        "callout_title", fontName="Helvetica-Bold", fontSize=10.5, leading=14,
        textColor=NAVY, spaceAfter=3,
    ),
    "callout_body": ParagraphStyle(
        "callout_body", fontName="Helvetica", fontSize=9.8, leading=14,
        textColor=colors.HexColor("#2b2a45"),
    ),
    "tag": ParagraphStyle(
        "tag", fontName="Helvetica-Bold", fontSize=8, leading=10,
        textColor=colors.white, alignment=1,
    ),
}


def bullets(items):
    return [Paragraph("&bull;&nbsp;&nbsp;" + t, styles["bullet"]) for t in items]


def step(number, title, items, tag=None):
    """One numbered step: navy badge + title (with optional tag) + bullets."""
    badge = Table([[Paragraph(str(number), styles["badge"])]],
                  colWidths=[10 * mm], rowHeights=[10 * mm])
    badge.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), NAVY),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("ROUNDEDCORNERS", [5, 5, 5, 5]),
    ]))

    title_flow = [Paragraph(title, styles["step_title"])]
    if tag:
        chip = Table([[Paragraph(tag, styles["tag"])]], colWidths=[34 * mm])
        chip.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), MAGENTA),
            ("TOPPADDING", (0, 0), (-1, -1), 3),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ]))
        title_flow.append(Spacer(1, 2))
        title_flow.append(chip)

    content = [
        Table([[title_flow]], colWidths=[(PAGE_W - 2 * MARGIN_X - 15 * mm)]),
        Spacer(1, 3),
    ] + bullets(items)

    row = Table(
        [[badge, content]],
        colWidths=[15 * mm, (PAGE_W - 2 * MARGIN_X - 15 * mm)],
    )
    row.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (0, 0), 0),
        ("LEFTPADDING", (1, 0), (1, 0), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    return KeepTogether([row, Spacer(1, 6)])


def callout(title, body, bg, line):
    inner = [Paragraph(title, styles["callout_title"]),
             Paragraph(body, styles["callout_body"])]
    box = Table([[inner]], colWidths=[(PAGE_W - 2 * MARGIN_X)])
    box.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), bg),
        ("LINEBEFORE", (0, 0), (0, -1), 3, line),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("ROUNDEDCORNERS", [6, 6, 6, 6]),
    ]))
    return KeepTogether([box, Spacer(1, 6)])


def header_footer(canvas, doc):
    canvas.saveState()
    # Header band
    canvas.setFillColor(NAVY)
    canvas.rect(0, PAGE_H - HEADER_H, PAGE_W, HEADER_H, stroke=0, fill=1)
    # Teal accent line under band
    canvas.setFillColor(TEAL)
    canvas.rect(0, PAGE_H - HEADER_H, PAGE_W, 2, stroke=0, fill=1)

    canvas.setFillColor(TEAL)
    canvas.setFont("Helvetica-Bold", 9)
    canvas.drawString(MARGIN_X, PAGE_H - 14 * mm, "DENTOVA")
    canvas.setFillColor(colors.white)
    canvas.setFont("Helvetica-Bold", 17)
    canvas.drawString(MARGIN_X, PAGE_H - 22 * mm, "Configuration Google Sheets")
    canvas.setFillColor(colors.HexColor("#b9b4d6"))
    canvas.setFont("Helvetica", 10)
    canvas.drawString(
        MARGIN_X, PAGE_H - 28.5 * mm,
        "Synchronisation automatique des reservations  -  environ 10 minutes",
    )

    # Footer
    canvas.setFillColor(colors.HexColor("#9a95b5"))
    canvas.setFont("Helvetica", 8)
    canvas.drawString(MARGIN_X, 9 * mm,
                      "Dentova - Formations dentaires premium")
    canvas.drawRightString(PAGE_W - MARGIN_X, 9 * mm,
                           "Guide de configuration - page %d" % doc.page)
    canvas.restoreState()


def build():
    doc = BaseDocTemplate(
        OUTPUT, pagesize=A4,
        leftMargin=MARGIN_X, rightMargin=MARGIN_X,
        topMargin=HEADER_H + 6 * mm, bottomMargin=FOOTER_H + 4 * mm,
        title="Dentova - Configuration Google Sheets",
        author="Dentova",
    )
    frame = Frame(
        MARGIN_X, FOOTER_H + 4 * mm,
        PAGE_W - 2 * MARGIN_X,
        PAGE_H - (HEADER_H + 6 * mm) - (FOOTER_H + 4 * mm),
        id="body", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0,
    )
    doc.addPageTemplates([PageTemplate(id="main", frames=[frame],
                                       onPage=header_footer)])

    story = []
    story.append(Paragraph(
        "Ce guide permet au site <b>Dentova</b> d'enregistrer automatiquement "
        "chaque reservation dans un Google Sheet, mis a jour en temps reel. "
        "Realisez ces etapes avec le <b>compte Gmail de l'entreprise</b> : "
        "c'est ce compte qui restera proprietaire des donnees.",
        styles["intro"]))
    story.append(Spacer(1, 6))

    story.append(step(
        1, "Creer un projet Google Cloud",
        [
            "Ouvrez <b>console.cloud.google.com</b> et connectez-vous avec le "
            "compte Gmail de l'entreprise.",
            "En haut a gauche, cliquez sur le selecteur de projet, puis sur "
            "<b>Nouveau projet</b>.",
            "Nommez-le <b>Dentova</b>, cliquez sur <b>Creer</b>, puis "
            "selectionnez ce projet.",
        ]))

    story.append(step(
        2, "Activer les deux services (APIs)",
        [
            "Menu principal, puis <b>APIs et services</b>, puis "
            "<b>Bibliotheque</b>.",
            "Recherchez <b>Google Sheets API</b> et cliquez sur <b>Activer</b>.",
            "Revenez a la Bibliotheque, recherchez <b>Google Drive API</b> et "
            "cliquez sur <b>Activer</b>.",
        ]))

    story.append(step(
        3, "Creer le compte de service",
        [
            "Menu, puis <b>APIs et services</b>, puis <b>Identifiants</b>.",
            "Cliquez sur <b>+ Creer des identifiants</b>, puis <b>Compte de "
            "service</b>.",
            "Nom : <b>dentova-sheets</b>. Cliquez sur <b>Creer et continuer</b>, "
            "laissez le role vide, puis <b>Terminer</b>.",
        ]))

    story.append(step(
        4, "Telecharger la cle (fichier JSON)",
        [
            "Cliquez sur le compte de service <b>dentova-sheets...</b> qui vient "
            "d'etre cree.",
            "Ouvrez l'onglet <b>Cles</b>, puis <b>Ajouter une cle</b>, puis "
            "<b>Creer une cle</b>.",
            "Choisissez le type <b>JSON</b> et cliquez sur <b>Creer</b> : un "
            "fichier <b>.json</b> se telecharge.",
        ],
        tag="A ENVOYER : FICHIER No 1"))

    story.append(callout(
        "Important - fichier confidentiel",
        "Ce fichier .json donne acces a vos donnees. Ne le publiez jamais en "
        "ligne et transmettez-le uniquement par un canal prive (message direct).",
        AMBER_BG, AMBER_LINE))

    story.append(step(
        5, "Creer la feuille et la partager",
        [
            "Ouvrez le fichier .json et copiez l'adresse indiquee apres "
            "<b>client_email</b> (elle finit par ...iam.gserviceaccount.com).",
            "Sur <b>sheets.google.com</b>, creez une feuille vierge nommee "
            "<b>Dentova - Reservations</b>.",
            "Cliquez sur <b>Partager</b>, collez cette adresse, choisissez le "
            "role <b>Editeur</b>, puis <b>Envoyer</b>.",
            "Dans l'adresse (URL) de la feuille, copiez l'identifiant situe "
            "entre <b>/d/</b> et <b>/edit</b>.",
        ],
        tag="A ENVOYER : INFO No 2"))

    story.append(callout(
        "A transmettre au developpeur",
        "1.&nbsp; Le fichier <b>.json</b> (etape 4)<br/>"
        "2.&nbsp; L'<b>identifiant de la feuille</b> Google (etape 5)",
        MINT, TEAL))

    doc.build(story)
    print("Wrote", OUTPUT)


if __name__ == "__main__":
    build()
